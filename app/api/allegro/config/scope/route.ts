import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const config = await prisma.config.findUnique({ where: { id: 1 } });
  return new NextResponse(JSON.stringify({ scope: config?.scope }), {
    status: 200,
  });
}

export async function POST(request: Request) {
  const { scope } = await request.json();
  await prisma.config.update({ where: { id: 1 }, data: { scope } });

  return new NextResponse(JSON.stringify({ message: "Zapisano" }), {
    status: 200,
  });
}
