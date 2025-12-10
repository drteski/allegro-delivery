import { NextResponse } from "next/server";
import fs from "node:fs";

export async function POST(request: Request) {
  const savedConfig = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  const { scope } = await request.json();
  fs.writeFileSync(
    "./config.json",
    JSON.stringify({
      scope: scope
        .split(" ")
        .filter((item: string) => item !== "")
        .join(" "),
      accounts: savedConfig.accounts,
    }),
    "utf-8",
  );

  return new NextResponse(JSON.stringify({ message: "ok" }), { status: 200 });
}
