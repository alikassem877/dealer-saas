import { NextResponse } from "next/server";

function notFound() {
  return NextResponse.json({ error: "API route not found." }, { status: 404 });
}

export async function GET() {
  return notFound();
}
export async function POST() {
  return notFound();
}
export async function PATCH() {
  return notFound();
}
export async function DELETE() {
  return notFound();
}