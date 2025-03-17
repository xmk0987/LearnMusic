"use client";
import PianoKeys from "./Keys/PianoKeys";
import { PianoOptions } from "./Options/PianoOptions";
import React from "react";
import styles from "./Piano.module.css";
import { Key } from "@/types/piano.types";
import { CheckResponse } from "../Exercise/Exercise";
import PianoCheck from "./Check/PianoCheck";
import type { Exercise } from "@/types/lessons.types";
import { PianoProvider } from "@/context/PianoContext";
import PianoHint from "./Hint/PianoHint";

interface PianoProps {
  checkExercise: (playedNotes: Key[]) => CheckResponse;
  type: "test" | "practice";
  exercise: Exercise;
  hint: string;
}

const Piano: React.FC<PianoProps> = ({
  checkExercise,
  type = "practice",
  exercise,
  hint,
}) => {
  return (
    <PianoProvider
      checkExercise={checkExercise}
      type={type}
      exercise={exercise}
    >
      <div className={styles.container}>
        <PianoOptions />
        <PianoKeys />
        <PianoHint hint={hint} />
        <PianoCheck />
      </div>
    </PianoProvider>
  );
};

export default Piano;
