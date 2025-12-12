import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const config = await prisma.config.findUnique({
    where: { id: 1 },
    include: { accounts: true },
  });
  return new NextResponse(JSON.stringify(config), { status: 200 });
}

export async function POST(request: Request) {
  const newAccount = await prisma.account.create({
    data: {
      ...{
        name: "Nowe konto",
        clientId: "",
        clientSecret: "",
        redirectUri: "",
        authorizationCode: "",
        accessToken: "",
        refreshToken: "",
        expiresIn: "",
      },
      configId: 1,
    },
  });
  return new NextResponse(JSON.stringify({ id: newAccount.id }), {
    status: 200,
  });
}
