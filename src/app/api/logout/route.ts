// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function GET() {
  await deleteSession();
  return NextResponse.json({ success: true });
}
