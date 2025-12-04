import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production-32chars";
const SECRET = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "auth-token";

export interface AuthPayload {
  barberId: string;
  barberName: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: AuthPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
