import { NextResponse } from "next/server";
import { getServices } from "@/lib/db";

export async function GET() {
  try {
    const services = getServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return NextResponse.json(
      { error: "Erro ao buscar serviços" },
      { status: 500 }
    );
  }
}
