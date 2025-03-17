"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./ScaleExercise.module.css";
import Piano from "../Piano/Piano";
import { Key } from "@/types/piano.types";
import { useRouter, useSearchParams } from "next/navigation";
import DynamicBreadcrumbs from "../DynamicBreadcrumbs/DynamicBreadcrumbs";
import { Exercise, Lesson } from "@/types/lessons.types";
import { calculateExpectedNotesWithOctaves } from "@/utils/helpers";

interface ScaleExerciseProps {
  exerciseId: number;
  lessonContent: Lesson;
}

export interface CheckResponse {
  completed: boolean;
  message: string;
  notes: {
    note: string;
    octave: number;
    status: "correct" | "wrongPosition" | "wrong";
  }[];
}

const ScaleExercise: React.FC<ScaleExerciseProps> = ({
  exerciseId,
  lessonContent,
}) => {
  const [scale, setScale] = useState<Exercise | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "test" | "practice";

  const goToScales = useCallback(() => {
    router.push("/lessons/scales");
  }, [router]);

  useEffect(() => {
    if (!type || !(type === "test" || type === "practice")) goToScales();
  }, [goToScales, router, type]);

  useEffect(() => {
    const foundExercise = lessonContent.exercises.find(
      (exercise) => exercise.id === exerciseId
    );
    setScale(foundExercise);
  }, [exerciseId, lessonContent]);

  const checkExercise = (playedKeys: Key[]): CheckResponse => {
    if (!scale) {
      return {
        completed: false,
        message: "Scale not loaded",
        notes: [],
      };
    }

    if (playedKeys.length === 0) {
      return {
        completed: false,
        message: "You need to play something",
        notes: [],
      };
    }

    const startingOctave = playedKeys[0].octave;
    const expectedNotesWithOctaves = calculateExpectedNotesWithOctaves(
      scale.notes,
      startingOctave
    );

    // Check each individual note whether its in the scale, wrong position or
    // completely wrong.
    const notesFeedback = playedKeys.map((key, index) => {
      const playedNoteStr = `${key.label}${key.octave}`;
      const expectedNoteStr = expectedNotesWithOctaves[index];

      const correct = playedNoteStr === expectedNoteStr;

      const isWrongPosition =
        scale.notes.includes(key.label) &&
        index <= scale.notes.length - 1 &&
        !correct;

      const status: "correct" | "wrongPosition" | "wrong" = correct
        ? "correct"
        : isWrongPosition
        ? "wrongPosition"
        : "wrong";

      return {
        note: key.label,
        octave: key.octave,
        status,
      };
    });

    // Create a descriptive message based on error or success
    const isTooMany = notesFeedback.length > scale.notes.length;

    const isTooLittle = notesFeedback.length < scale.notes.length;

    const completed =
      notesFeedback.every((note) => note.status === "correct") &&
      notesFeedback.length === expectedNotesWithOctaves.length;

    const message = completed
      ? "CORRECT!"
      : isTooMany
      ? "You have too many notes"
      : isTooLittle
      ? "You didn't select enough notes"
      : "Some notes are not correct!";

    return { completed, message, notes: notesFeedback };
  };

  if (!type || !scale) return <h1>Loading scale...</h1>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>{scale.name}</h1>
          <button onClick={goToScales}>X</button>
        </div>
        <DynamicBreadcrumbs />
      </div>
      <p className={styles.instructions}>
        Play all {scale?.name} notes in order.
      </p>
      <Piano checkExercise={checkExercise} type={type} scale={scale} />
    </div>
  );
};

export default ScaleExercise;
