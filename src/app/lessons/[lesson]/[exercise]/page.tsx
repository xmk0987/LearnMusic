"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLessonData } from "@/context/LessonDataContext";
import { LessonKey, Lessons } from "@/types/lessons.types";
import ScaleExercise from "@/components/ScaleExercise/ScaleExercise";

const exerciseComponents: {
  [key in LessonKey]: React.FC<{
    exercise: string;
    lessonContent: Lessons[LessonKey];
  }>;
} = {
  scales: ScaleExercise,
};

const ExercisePage = () => {
  const router = useRouter();
  const params = useParams() as { exercise: string };
  const decodedExercise = decodeURIComponent(params.exercise);
  const { lessonContent, lesson } = useLessonData() as {
    lessonContent: Lessons[LessonKey];
    lesson: LessonKey;
  };

  const ExerciseComponent = exerciseComponents[lesson];

  useEffect(() => {
    if (!ExerciseComponent) {
      router.push("/lessons");
    }
  }, [ExerciseComponent, router]);

  if (!ExerciseComponent || !lessonContent) return null;

  return (
    <ExerciseComponent
      exercise={decodedExercise}
      lessonContent={lessonContent}
    />
  );
};

export default ExercisePage;
