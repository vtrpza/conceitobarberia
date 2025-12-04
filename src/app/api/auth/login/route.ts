import { NextRequest, NextResponse } from "next/server";
import { getBarberByPhone } from "@/lib/db";
import { verifyPassword, createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Telefone e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar barbeiro pelo telefone
    const barber = getBarberByPhone(phone);
    if (!barber) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Verificar senha
    const isValidPassword = await verifyPassword(password, barber.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Criar token JWT
    const token = await createToken({
      barberId: barber.id,
      barberName: barber.name,
    });

    // Criar resposta com cookie
    const response = NextResponse.json({
      success: true,
      barber: {
        id: barber.id,
        name: barber.name,
      },
    });

    // Configurar cookie HTTP-only
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
