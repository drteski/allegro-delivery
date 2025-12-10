import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const { scope } = await request.json();
  await prisma.config.update({ where: { id: 1 }, data: { scope } });

  return new NextResponse(JSON.stringify({ message: "ok" }), { status: 200 });
}
