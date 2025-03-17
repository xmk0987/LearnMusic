"use client";
import React from "react";
import styles from "./Exercise.module.css";
import Piano from "../Piano/Piano";
import { Key } from "@/types/piano.types";
import DynamicBreadcrumbs from "../DynamicBreadcrumbs/DynamicBreadcrumbs";
import type { Exercise as CurrentExercise, Lesson } from "@/types/lessons.types";

export interface CheckResponse {
  completed: boolean;
  message: string;
  notes: {
    note: string;
    octave: number;
    status: "correct" | "wrongPosition" | "wrong";
  }[];
}

interface ExerciseProps {
  type: "test" | "practice";
  currentExercise: CurrentExercise;
  currentLesson: Lesson;
  checkExerciseByCategoryAndType: (playedKeys: Key[]) => CheckResponse;
}

const Exercise: React.FC<ExerciseProps> = ({
  type,
  currentExercise,
  currentLesson,
  checkExerciseByCategoryAndType,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>{currentExercise.name}</h1>
          <button onClick={() => console.log("Leave exercise")}>X</button>
        </div>
        <DynamicBreadcrumbs />
      </div>
      <p className={styles.instructions}>{currentLesson.task}</p>
      <Piano
        checkExercise={checkExerciseByCategoryAndType}
        type={type}
        exercise={currentExercise}
        hint={currentLesson.hint}
      />
    </div>
  );
};

export default Exercise;
