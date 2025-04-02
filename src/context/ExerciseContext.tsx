"use client";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, createContext, useContext, useMemo } from "react";
import type { Chapter, Exercise } from "@/types/chapters.types";
import { useChaptersData } from "./ChaptersContext";
import { useUser } from "./UserContext";

interface ExerciseContextValue {
  currentExercise: Exercise;
  currentChapter: Chapter;
  type: "test" | "practice";
  showHint: boolean;
  toggleShowHint: () => void;
  goToChapter: () => void;
  goToNextExercise: () => void;
  isLastExercise: boolean;
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
  const params = useParams<{ exerciseId: string }>();
  const exerciseId = params?.exerciseId || null;
  const { user, loading } = useUser();

  const searchParams = useSearchParams();
  const type = (searchParams?.get("type") as "test" | "practice") || "practice";

  const { currentChapter } = useChaptersData();

  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allExercises = useMemo(() => {
    return (
      currentChapter?.lesson?.sections?.flatMap((section) =>
        Array.isArray(section.exercises) ? section.exercises : []
      ) || []
    );
  }, [currentChapter]);

  useEffect(() => {
    if (!currentChapter) {
      setError("Chapter not found");
      router.push("/chapters");
    }
  }, [currentChapter, router]);

  useEffect(() => {
    if (type === "test" && !user && !loading) {
      router.push("/login");
    }
  }, [loading, router, type, user]);

  useEffect(() => {
    if (exerciseId) {
      const foundExercise = allExercises.find((ex) => ex.id === exerciseId);
      if (foundExercise) {
        setCurrentExercise(foundExercise);
        setError(null);
      } else {
        setError("Exercise not found");
      }
    }
  }, [allExercises, exerciseId]);

  const isLastExercise = useMemo(() => {
    return allExercises.length > 0
      ? allExercises[allExercises.length - 1].id === currentExercise?.id
      : false;
  }, [currentExercise, allExercises]);

  if (error || !currentExercise || !currentChapter) {
    return <h1>{error || "Exercise not found"}</h1>;
  }

  const goToChapter = () => {
    router.push("/chapters/" + currentChapter.id);
  };

  const goToNextExercise = () => {
    const baseUrl = `/chapters/${currentChapter.id}`;
    if (isLastExercise) {
      router.push(baseUrl);
    } else {
      const currentExerciseIndex = allExercises.findIndex(
        (ex) => ex.id === currentExercise.id
      );
      const nextExercise = allExercises[currentExerciseIndex + 1];
      router.push(`${baseUrl}/${nextExercise.id}?type=${type}`);
    }
  };

  const toggleShowHint = () => {
    setShowHint(!showHint);
  };

  return (
    <ExerciseContext.Provider
      value={{
        currentExercise,
        currentChapter,
        showHint,
        isLastExercise,
        goToNextExercise,
        toggleShowHint,
        type,
        goToChapter,
      }}
    >
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
