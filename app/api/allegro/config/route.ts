import { NextResponse } from "next/server";
import fs from "node:fs";

export async function GET() {
  const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  return new NextResponse(JSON.stringify(config), { status: 200 });
}
