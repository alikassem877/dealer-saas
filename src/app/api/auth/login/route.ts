import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // Deliberately vague error — see explanation below
  const invalidCredentials = NextResponse.json(
    { error: "Invalid email or password" },
    { status: 401 }
  );

  if (!user) return invalidCredentials;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return invalidCredentials;

  const token = signToken({
    userId: user.id,
    role: user.role,
    dealershipId: user.dealershipId,
  });

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}