"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import ScaleExercise from "@/components/scaleExercise/ScaleExercise";

const exerciseComponents: Record<string, React.FC<{ exercise: string }>> = {
  scales: ScaleExercise,
};

const ExercisePage = () => {
  const router = useRouter();
  const params = useParams() as { lesson: string; exercise: string };
  const { lesson, exercise } = params;

  const ExerciseComponent = exerciseComponents[lesson];

  useEffect(() => {
    if (!ExerciseComponent) {
      router.push("/lessons");
    }
  }, [ExerciseComponent, router]);

  if (!ExerciseComponent) return null;

  return <ExerciseComponent exercise={exercise} />;
};

export default ExercisePage;
