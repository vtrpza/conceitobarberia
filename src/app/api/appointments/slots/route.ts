import { NextRequest, NextResponse } from "next/server";
import { getBarberById, getAppointmentsByBarberAndDate } from "@/lib/db";

interface TimeSlot {
  time: string;
  available: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const barberId = searchParams.get("barberId");
    const date = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration") || "30", 10);

    if (!barberId || !date) {
      return NextResponse.json(
        { error: "barberId e date são obrigatórios" },
        { status: 400 }
      );
    }

    const barber = getBarberById(barberId);
    if (!barber) {
      return NextResponse.json(
        { error: "Barbeiro não encontrado" },
        { status: 404 }
      );
    }

    const workingHours = JSON.parse(barber.working_hours);
    const dayOfWeek = new Date(date + "T12:00:00")
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const daySchedule = workingHours[dayOfWeek];

    if (!daySchedule) {
      return NextResponse.json([]);
    }

    const appointments = getAppointmentsByBarberAndDate(barberId, date);
    const bookedTimes = appointments.map((a) => a.time);

    const slots: TimeSlot[] = [];

    const [startHour, startMin] = daySchedule.start.split(":").map(Number);
    const [endHour, endMin] = daySchedule.end.split(":").map(Number);

    let currentTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    while (currentTime + duration <= endTime) {
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      // Verificar se está em horário de intervalo
      const isBreak = daySchedule.breaks?.some((b: { start: string; end: string }) => {
        const [breakStartH, breakStartM] = b.start.split(":").map(Number);
        const [breakEndH, breakEndM] = b.end.split(":").map(Number);
        const breakStart = breakStartH * 60 + breakStartM;
        const breakEnd = breakEndH * 60 + breakEndM;
        return currentTime >= breakStart && currentTime < breakEnd;
      });

      // Verificar se já tem agendamento
      const isBooked = bookedTimes.includes(timeStr);

      // Verificar se é horário passado (se for hoje)
      const today = new Date().toISOString().split("T")[0];
      const now = new Date();
      const isPast =
        date === today &&
        (hours < now.getHours() ||
          (hours === now.getHours() && minutes <= now.getMinutes()));

      slots.push({
        time: timeStr,
        available: !isBreak && !isBooked && !isPast,
      });

      currentTime += 30; // Intervalos de 30 minutos
    }

    return NextResponse.json(slots);
  } catch (error) {
    console.error("Erro ao buscar horários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar horários disponíveis" },
      { status: 500 }
    );
  }
}
