import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimit = checkRateLimit(`register:${ip}`, { limit: 3, windowMs: 60_000 });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    );
  }

  const body = await request.json();

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { dealershipName, dealershipEmail, ownerName, ownerEmail, password } =
    parsed.data;

  // Check both emails are free BEFORE starting the transaction
  const [existingDealership, existingUser] = await Promise.all([
    prisma.dealership.findUnique({ where: { email: dealershipEmail } }),
    prisma.user.findUnique({ where: { email: ownerEmail } }),
  ]);

  if (existingDealership) {
    return NextResponse.json(
      { error: "A dealership with this email already exists" },
      { status: 409 }
    );
  }
  if (existingUser) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  // Create Dealership + User together — both succeed or both fail
  const { dealership, user } = await prisma.$transaction(async (tx) => {
    const dealership = await tx.dealership.create({
      data: {
        name: dealershipName,
        email: dealershipEmail,
      },
    });

    const user = await tx.user.create({
      data: {
        name: ownerName,
        email: ownerEmail,
        passwordHash,
        role: "DEALERSHIP_OWNER",
        dealershipId: dealership.id,
      },
    });

    return { dealership, user };
  });

  const token = signToken({
    userId: user.id,
    role: user.role,
    dealershipId: user.dealershipId,
  });

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    dealership: { id: dealership.id, name: dealership.name },
  });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days, in seconds
  });

  return response;
}