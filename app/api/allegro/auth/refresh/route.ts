import { NextResponse } from "next/server";
import fs from "node:fs";
import { ConfigAllegro } from "@/lib/types";
import axios from "axios";

export async function POST(request: Request) {
  const savedConfig = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  const account = await request.json();
  const existingConfig = savedConfig.accounts.find(
    (item: ConfigAllegro) => item.id === account.id,
  );
  if (!existingConfig)
    return new NextResponse(JSON.stringify({ message: "Konto nie istnieje" }), {
      status: 200,
    });
  try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refreshToken,
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
    fs.writeFileSync(
      "./config.json",
      JSON.stringify({
        scope: savedConfig.scope,
        accounts: [
          ...savedConfig.accounts.filter(
            (item: ConfigAllegro) => item.id !== account.id,
          ),
          {
            ...account,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresIn: Date.now() + tokens.expires_in * 1000,
          },
        ].sort((a: ConfigAllegro, b: ConfigAllegro) => a.id - b.id),
      }),
      "utf-8",
    );

    return new NextResponse(JSON.stringify({}), { status: 200 });
  } catch (err) {
    console.log(err.response?.data || err.message);
    return new NextResponse(JSON.stringify({}), { status: 200 });
  }
}
