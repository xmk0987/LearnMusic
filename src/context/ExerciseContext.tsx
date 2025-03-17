"use client";
import { useParams, useRouter } from "next/navigation";
import { useLessonsData } from "@/context/LessonsContext";
import { useEffect, useState, createContext, useContext } from "react";
import type { Exercise, Lesson } from "@/types/lessons.types";

interface ExerciseContextValue {
  currentExercise: Exercise;
  currentLesson: Lesson;
}

interface ExerciseProviderProps {
  children: React.ReactNode;
}

const ExerciseContext = createContext<ExerciseContextValue | undefined>(
  undefined
);

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { currentLesson } = useLessonsData();
  const [currentExercise, setCurrentExercise] = useState<Exercise | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentLesson) {
      setError("Lesson not found");
      router.push("/lessons");
    }
  }, [currentLesson, router]);

  useEffect(() => {
    if (exerciseId && currentLesson) {
      const foundExercise = currentLesson.exercises.find(
        (exercise) => exercise.id === parseInt(exerciseId)
      );
      if (foundExercise) {
        setCurrentExercise(foundExercise);
        setError(null);
      } else {
        setError("Exercise not found");
      }
      setLoading(false);
    }
  }, [currentLesson, exerciseId]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !currentExercise || !currentLesson) {
    return <h1>{error || "Exercise or Lesson not found"}</h1>;
  }

  return (
    <ExerciseContext.Provider value={{ currentExercise, currentLesson }}>
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error("useExercise must be used within a ExerciseProvider");
  }
  return context;
};
