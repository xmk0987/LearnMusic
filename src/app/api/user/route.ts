import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/dbModels/User";

export async function GET() {
  const session = await getSession();

  const userId = session?.userId;
  let user = null;

  if (!userId) {
    return NextResponse.json({ error: "User not logged in" }, { status: 401 });
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ _id: userId });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user = existingUser.toPublicUser();
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }

  return NextResponse.json({ user });
}
