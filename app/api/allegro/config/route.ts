import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const config = await prisma.config.findUnique({
    where: { id: 1 },
    include: { accounts: true },
  });
  return new NextResponse(JSON.stringify(config), { status: 200 });
}
