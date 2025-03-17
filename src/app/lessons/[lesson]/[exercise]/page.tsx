"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLessonsData } from "@/context/LessonsProvider";
import ScaleExercise from "@/components/ScaleExercise/ScaleExercise";
import { LessonCategory, Lesson } from "@/types/lessons.types";

const exerciseComponents: {
  [key in LessonCategory]: React.FC<{
    exerciseId: number;
    lessonContent: Lesson;
  }>;
} = {
  scales: ScaleExercise,
};

const ExercisePage = () => {
  const router = useRouter();
  const { lesson, exercise } = useParams<{
    lesson: string;
    exercise: string;
  }>();
  const { getLessonById } = useLessonsData();
  const lessonContent = getLessonById(parseInt(lesson));

  useEffect(() => {
    if (!lessonContent) {
      router.push("/lessons");
    }
  }, [lessonContent, router]);

  if (!lessonContent) return <h1>Loading lesson...</h1>;

  const ExerciseComponent = exerciseComponents[lessonContent.category];

  if (!ExerciseComponent) {
    return <h1>Category not supported</h1>;
  }

  return (
    <ExerciseComponent
      exerciseId={parseInt(exercise)}
      lessonContent={lessonContent}
    />
  );
};

export default ExercisePage;
