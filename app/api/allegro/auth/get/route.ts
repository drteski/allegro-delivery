import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const account = await request.json();
  const existingConfig = await prisma.account.findUnique({
    where: { id: account.id },
  });
  if (!existingConfig)
    return new NextResponse(JSON.stringify({ message: "Konto nie istnieje" }), {
      status: 200,
    });
  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: account.authorizationCode,
      redirect_uri: account.redirectUri,
    });

    const auth = Buffer.from(
      `${account.clientId}:${account.clientSecret}`,
    ).toString("base64");

    const tokens = await axios
      .post("https://allegro.pl/auth/oauth/token", params.toString(), {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data);
    await prisma.account.update({
      where: { id: existingConfig.id },
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: `${Date.now() + tokens.expires_in * 1000}`,
      },
    });
    return new NextResponse(JSON.stringify({ message: "Tokeny pobrane" }), {
      status: 200,
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Axios error:", err.response?.data ?? err.message);
      return new NextResponse(
        JSON.stringify({ message: err.response?.data ?? err.message }),
        {
          status: 200,
        },
      );
    } else if (err instanceof Error) {
      console.error("Error:", err.message);
    } else {
      console.error("Unknown error:", err);
    }
    return new NextResponse(JSON.stringify({}), { status: 200 });
  }
}
