"use client";
import PianoKeys from "./Keys/PianoKeys";
import { PianoOptions } from "./Options/PianoOptions";
import React from "react";
import styles from "./Piano.module.css";
import { Key } from "@/types/piano.types";
import { CheckResponse } from "../ScaleExercise/ScaleExercise";
import PianoCheck from "./Check/PianoCheck";
import { Scale } from "@/types/lessons.types";
import { PianoProvider } from "@/context/PianoContext";

interface PianoProps {
  checkExercise: (playedNotes: Key[]) => CheckResponse;
  type?: "test" | "practice";
  scale?: Scale;
}

const Piano: React.FC<PianoProps> = ({
  checkExercise,
  type = "practice",
  scale,
}) => {
  return (
    <PianoProvider checkExercise={checkExercise} type={type} scale={scale}>
      <div className={styles.container}>
        <PianoOptions />
        <PianoKeys />
        <PianoCheck />
      </div>
    </PianoProvider>
  );
};

export default Piano;
