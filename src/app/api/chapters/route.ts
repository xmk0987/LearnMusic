import { NextResponse } from "next/server";
import Chapter from "@/dbModels/Chapter";
import dbConnect from "@/lib/db";
import Exercise from "@/dbModels/Exercise";
import Scale from "@/dbModels/Scale";

export async function GET() {
  try {
    await dbConnect();

    const chapters = await Chapter.find().populate({
      path: "lesson.sections.exercises",
      model: Exercise,
      populate: {
        path: "scale",
        model: Scale,
        strictPopulate: false,
      },
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters data" },
      { status: 500 }
    );
  }
}
