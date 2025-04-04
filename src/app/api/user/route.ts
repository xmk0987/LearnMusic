// /api/user/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/dbModels/User";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    await connectDB();
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return NextResponse.json({ user: null });
    }

    const user = existingUser.toPublicUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
