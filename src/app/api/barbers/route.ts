import { NextResponse } from "next/server";
import { getBarbers } from "@/lib/db";

export async function GET() {
  try {
    const barbers = getBarbers();

    // Formatar os dados para o frontend
    const formattedBarbers = barbers.map((barber) => ({
      id: barber.id,
      name: barber.name,
      phone: barber.phone,
      avatar: barber.avatar,
      services: barber.services,
      workingHours: JSON.parse(barber.working_hours),
    }));

    return NextResponse.json(formattedBarbers);
  } catch (error) {
    console.error("Erro ao buscar barbeiros:", error);
    return NextResponse.json(
      { error: "Erro ao buscar barbeiros" },
      { status: 500 }
    );
  }
}
