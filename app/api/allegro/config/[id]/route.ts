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
  const existingConfig = await prisma.account.findUnique({
    where: { id: parseInt(id, 10) },
  });
  console.log(account);
  await prisma.account.update({
    where: { id: parseInt(id, 10) },
    data: {
      ...account,
      accessToken:
        existingConfig?.accessToken !== account.accessToken
          ? ""
          : account.accessToken,
      refreshToken:
        existingConfig?.refreshToken !== account.refreshToken
          ? ""
          : account.refreshToken,
    },
  });
  return new NextResponse(JSON.stringify({ message: "ok" }), { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const existingConfig = await prisma.account.findUnique({
    where: { id: parseInt(id, 10) },
  });
  if (existingConfig)
    await prisma.account.delete({ where: { id: parseInt(id, 10) } });

  return new NextResponse(JSON.stringify({ message: "ok" }), { status: 200 });
}
