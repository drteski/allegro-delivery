import { NextResponse } from "next/server";
import fs from "node:fs";
import { ConfigAllegro } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const savedConfig = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  return new NextResponse(
    JSON.stringify({
      config: savedConfig.accounts.find(
        (item: ConfigAllegro) => item.id === parseInt(id, 10),
      ),
    }),
    {
      status: 200,
    },
  );
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const savedConfig = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  const account = await request.json();
  const { id } = await params;
  const existingConfig = savedConfig.accounts.find(
    (item: ConfigAllegro) => item.id === parseInt(id, 10),
  );
  if (!existingConfig) {
    fs.writeFileSync(
      "./config.json",
      JSON.stringify({
        scope: savedConfig.scope,
        accounts: [...savedConfig.accounts, account],
      }),
      "utf-8",
    );
  } else {
    const updatedAccount = {
      ...account,
      accessToken:
        existingConfig.accessToken !== account.accessToken
          ? ""
          : account.accessToken,
      refreshToken:
        existingConfig.refreshToken !== account.refreshToken
          ? ""
          : account.refreshToken,
    };
    fs.writeFileSync(
      "./config.json",
      JSON.stringify({
        scope: savedConfig.scope,
        accounts: [
          ...savedConfig.accounts.filter(
            (item: ConfigAllegro) => item.id !== parseInt(id, 10),
          ),
          updatedAccount,
        ].sort((a: ConfigAllegro, b: ConfigAllegro) => a.id - b.id),
      }),
      "utf-8",
    );
  }

  return new NextResponse(JSON.stringify({ message: "ok" }), { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const savedConfig = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  const { id } = await params;
  fs.writeFileSync(
    "./config.json",
    JSON.stringify({
      scope: savedConfig.scope,
      accounts: savedConfig.accounts
        .filter((item: ConfigAllegro) => item.id !== parseInt(id, 10))
        .sort((a: ConfigAllegro, b: ConfigAllegro) => a.id - b.id),
    }),
    "utf-8",
  );

  return new NextResponse(JSON.stringify({ message: "ok" }), { status: 200 });
}
