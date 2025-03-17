"use client";
import React from "react";
import Exercise from "@/components/Exercise/Exercise";
import { useSearchParams } from "next/navigation";
import { useExercise } from "@/context/ExerciseContext";
import { Key } from "@/types/piano.types";
import { checkPlayExercise } from "@/utils/checkExercise";
import type { CheckResponse } from "@/components/Exercise/Exercise";

const ExercisePage = () => {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as "test" | "practice") || "practice";
  const { currentExercise, currentLesson } = useExercise();

  const checkExerciseByCategoryAndType = (playedKeys: Key[]): CheckResponse => {
    if (!currentExercise || !currentLesson) {
      return {
        completed: false,
        message: "Exercise not loaded",
        notes: [],
      };
    }

    switch (currentLesson.category) {
      case "scales":
        switch (currentLesson.type) {
          case "play":
            return checkPlayExercise(currentExercise, playedKeys);
          default:
            return {
              completed: false,
              message: "Unknown exercise type",
              notes: [],
            };
        }
      case "chords":
        switch (currentLesson.type) {
          case "play":
            return checkPlayExercise(currentExercise, playedKeys);
          default:
            return {
              completed: false,
              message: "Unknown exercise type",
              notes: [],
            };
        }
      default:
        return {
          completed: false,
          message: "Unknown exercise category",
          notes: [],
        };
    }
  };

  if (!currentExercise || !currentLesson) return <h1>Loading exercise...</h1>;

  return (
    <Exercise
      type={type}
      currentExercise={currentExercise}
      currentLesson={currentLesson}
      checkExerciseByCategoryAndType={checkExerciseByCategoryAndType}
    />
  );
};

export default ExercisePage;
