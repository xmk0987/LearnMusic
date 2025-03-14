"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./ScaleExercise.module.css";
import Piano from "../Piano/Piano";
import { Key } from "@/lib/pianoConfig";
import { useRouter, useSearchParams } from "next/navigation";
import DynamicBreadcrumbs from "../DynamicBreadcrumbs/DynamicBreadcrumbs";
import { Lessons, Scale } from "@/types/lessons.types";

interface ScaleExerciseProps {
  exercise: string;
  lessonContent: Lessons["scales"];
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
  exercise,
  lessonContent,
}) => {
  const [scale, setScale] = useState<Scale | undefined>(undefined);
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
    if (lessonContent) {
      const parts = exercise.split("-");

      const normalizeWord = (word: string) => {
        if (word.includes("/")) {
          return word
            .split("/")
            .map(
              (segment) => segment.charAt(0).toUpperCase() + segment.slice(1)
            )
            .join("/");
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      };

      const normalizedName = parts.map(normalizeWord).join(" ");

      const scaleList =
        parts[1].toLowerCase() === "major"
          ? lessonContent.majors
          : lessonContent.minors;

      const foundScale = scaleList.find(
        (scale) => scale.name === normalizedName
      );

      setScale(foundScale);
    }
  }, [exercise, lessonContent]);

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

    const noteMap: { [key: string]: number } = {
      C: 0,
      "C#/Db": 1,
      D: 2,
      "D#/Eb": 3,
      E: 4,
      F: 5,
      "F#/Gb": 6,
      G: 7,
      "G#/Ab": 8,
      A: 9,
      "A#/Bb": 10,
      B: 11,
    };

    // Determine starting octave from the first played key.
    // Increase octave when necessary
    const startingOctave = playedKeys[0].octave;
    let currentOctave = startingOctave;
    let previousPitch = noteMap[scale.notes[0]];

    const expectedNotesWithOctaves = scale.notes.map((note, index) => {
      const currentPitch = noteMap[note];
      if (index > 0 && currentPitch <= previousPitch) {
        currentOctave++;
      }
      previousPitch = currentPitch;
      return `${note}${currentOctave}`;
    });

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
      <Piano checkExercise={checkExercise} type={type} scale={scale.name} />
    </div>
  );
};

export default ScaleExercise;
