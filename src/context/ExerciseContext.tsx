"use client";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useLessonsData } from "@/context/LessonsContext";
import { useEffect, useState, createContext, useContext, useMemo } from "react";
import type { Exercise, Lesson } from "@/types/lessons.types";
import type { Key } from "@/types/piano.types";
import { checkPlayExercise } from "@/utils/checkExercise";

export interface CheckResponseNote {
  note: string;
  octave: number;
  status: "correct" | "wrongPosition" | "wrong";
}
export interface CheckResponse {
  completed: boolean;
  message: string;
  notes: CheckResponseNote[];
}

interface ExerciseContextValue {
  currentExercise: Exercise;
  currentLesson: Lesson;
  type: "test" | "practice";
  checkResponse: CheckResponse | null;
  showHint: boolean;
  toggleShowHint: () => void;
  goToLesson: () => void;
  closeCheckResponse: () => void;
  checkExerciseByCategoryAndType: (playedKeys: Key[]) => void;
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
  const type = (searchParams.get("type") as "test" | "practice") || "practice";

  const { currentLesson } = useLessonsData();
  const [currentExercise, setCurrentExercise] = useState<Exercise | undefined>(
    undefined
  );
  const [showHint, setShowHint] = useState<boolean>(false);
  const [checkResponse, setCheckResponse] = useState<CheckResponse | null>(
    null
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
        console.log("Found exercise", foundExercise);
        setCurrentExercise(foundExercise);
        setError(null);
      } else {
        setError("Exercise not found");
      }
      setLoading(false);
    }
  }, [currentLesson, exerciseId]);

  const isLastExercise = useMemo(
    () =>
      currentLesson?.exercises[currentLesson.exercises.length - 1].id ===
      currentExercise?.id,
    [currentExercise?.id, currentLesson?.exercises]
  );

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !currentExercise || !currentLesson) {
    return <h1>{error || "Exercise or Lesson not found"}</h1>;
  }

  const checkExerciseByCategoryAndType = (playedKeys: Key[]): void => {
    let response: CheckResponse | null = null;
    switch (currentLesson.category) {
      case "scales":
        switch (currentLesson.type) {
          case "play":
            response = checkPlayExercise(currentExercise, playedKeys);
            break;
          default:
            response = {
              completed: false,
              message: "Unknown exercise type",
              notes: [],
            };
            break;
        }
        break;
      case "chords":
        switch (currentLesson.type) {
          case "play":
            response = checkPlayExercise(currentExercise, playedKeys);
            break;
          default:
            response = {
              completed: false,
              message: "Unknown exercise type",
              notes: [],
            };
            break;
        }
        break;
      default:
        console.log("Arrives here");
        response = {
          completed: false,
          message: "Unknown exercise category",
          notes: [],
        };
        break;
    }
    setCheckResponse(response);
  };

  const goToLesson = () => {
    router.push("/lessons/" + currentLesson.id);
  };

  const goToNextExercise = () => {
    const baseUrl = `/lessons/${currentLesson.id}`;
    if (isLastExercise) {
      router.push(baseUrl);
    } else {
      router.push(`${baseUrl}/${currentExercise.id + 1}?type=${type}`);
    }
  };

  const toggleShowHint = () => {
    setShowHint(!showHint);
  };

  const closeCheckResponse = () => {
    setCheckResponse(null);
  };

  return (
    <ExerciseContext.Provider
      value={{
        currentExercise,
        currentLesson,
        showHint,
        checkResponse,
        isLastExercise,
        goToNextExercise,
        toggleShowHint,
        type,
        closeCheckResponse,
        checkExerciseByCategoryAndType,
        goToLesson,
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
