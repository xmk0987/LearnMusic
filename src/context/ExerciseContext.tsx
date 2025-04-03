"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, createContext, useContext, useMemo } from "react";
import type { Chapter, Exercise } from "@/types/chapters.types";
import { useChaptersData } from "./ChaptersContext";
import { useUser } from "./UserContext";

interface ExerciseContextValue {
  currentExercise?: Exercise;
  currentChapter?: Chapter;
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
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const searchParams = useSearchParams();
  const { currentChapter } = useChaptersData();
  const { user, loading: userLoading } = useUser();

  const type = (searchParams?.get("type") as "test" | "practice") || "practice";

  const allExercises = useMemo(() => {
    return (
      currentChapter?.lesson?.sections?.flatMap(
        (section) => section.exercises || []
      ) || []
    );
  }, [currentChapter]);

  const currentExercise = useMemo(() => {
    return allExercises.find((ex) => ex._id === exerciseId);
  }, [allExercises, exerciseId]);

  const isLastExercise = useMemo(() => {
    return (
      allExercises.length > 0 &&
      allExercises[allExercises.length - 1]._id === currentExercise?._id
    );
  }, [currentExercise, allExercises]);

  useEffect(() => {
    if (!currentChapter) {
      router.replace("/chapters");
    }
  }, [currentChapter, router]);

  useEffect(() => {
    if (type === "test" && !user && !userLoading) {
      router.replace("/login");
    }
  }, [user, userLoading, type, router]);

  const goToChapter = () => {
    if (currentChapter) {
      router.push(`/chapters/${currentChapter._id}`);
    }
  };

  const goToNextExercise = () => {
    if (currentChapter && currentExercise) {
      const currentIndex = allExercises.findIndex(
        (ex) => ex._id === currentExercise._id
      );
      const nextExercise = allExercises[currentIndex + 1];

      if (nextExercise) {
        router.push(
          `/chapters/${currentChapter._id}/${nextExercise._id}?type=${type}`
        );
      } else {
        router.push(`/chapters/${currentChapter._id}`);
      }
    }
  };

  const [showHint, setShowHint] = useState(false);
  const toggleShowHint = () => setShowHint((prev) => !prev);

  return (
    <ExerciseContext.Provider
      value={{
        currentExercise,
        currentChapter,
        type,
        showHint,
        toggleShowHint,
        goToChapter,
        goToNextExercise,
        isLastExercise,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error("useExercise must be used within an ExerciseProvider");
  }
  return context;
};
