import { NextRequest, NextResponse } from "next/server";
import {
  createAppointment,
  checkSlotAvailable,
  getAppointmentsByDateRange,
} from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// POST - Criar novo agendamento (público)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientPhone, barberId, serviceId, date, time, notes } = body;

    // Validação básica
    if (!clientName || !clientPhone || !barberId || !serviceId || !date || !time) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o horário está disponível
    const isAvailable = await checkSlotAvailable(barberId, date, time);
    if (!isAvailable) {
      return NextResponse.json(
        { error: "Este horário não está mais disponível" },
        { status: 409 }
      );
    }

    // Criar o agendamento
    const apt = await createAppointment({
      clientName,
      clientPhone,
      barberId,
      serviceId,
      date,
      time,
      notes,
    });

    // Formatar resposta
    const appointment = {
      id: apt.id,
      clientName: apt.client_name,
      clientPhone: apt.client_phone,
      barberId: apt.barber_id,
      serviceId: apt.service_id,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      notes: apt.notes,
      createdAt: apt.created_at,
    };

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 }
    );
  }
}

// GET - Listar agendamentos (requer autenticação)
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    // Parâmetros de filtro
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const barberId = searchParams.get("barberId");

    // Por padrão, buscar agendamentos dos próximos 7 dias
    const startDate = date || new Date().toISOString().split("T")[0];
    const endDate = date || (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split("T")[0];
    })();

    const appointments = await getAppointmentsByDateRange(
      startDate,
      endDate,
      barberId || undefined
    );

    // Formatar para o frontend
    const formatted = appointments.map((apt) => ({
      id: apt.id,
      clientName: apt.client_name,
      clientPhone: apt.client_phone,
      barberId: apt.barber_id,
      serviceId: apt.service_id,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      notes: apt.notes,
      createdAt: apt.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
}
