import { NextResponse } from "next/server";
import prisma from "@/lib/db";
type Params = Promise<{ id: string }>;
export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const account = await prisma.account.findUnique({
    where: { id: parseInt(id, 10) },
  });
  return new NextResponse(
    JSON.stringify({
      account,
    }),
    {
      status: 200,
    },
  );
}

export async function POST(request: Request, { params }: { params: Params }) {
  const account = await request.json();
  const { id } = await params;
  await prisma.account.update({
    where: { id: parseInt(id, 10) },
    data: { ...account },
  });
  return new NextResponse(JSON.stringify({ message: "Zapisano" }), {
    status: 200,
  });
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const existingConfig = await prisma.account.findUnique({
    where: { id: parseInt(id, 10) },
  });
  if (existingConfig)
    await prisma.account.delete({ where: { id: parseInt(id, 10) } });

  return new NextResponse(JSON.stringify({ message: "Usunięto" }), {
    status: 200,
  });
}
