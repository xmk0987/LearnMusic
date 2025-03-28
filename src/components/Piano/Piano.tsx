"use client";
import PianoKeys from "./Keys/PianoKeys";
import { PianoOptions } from "./Options/PianoOptions";
import React from "react";
import styles from "./Piano.module.css";
import { PianoProvider } from "@/context/PianoContext";
import type { ExerciseConfig } from "@/types/piano.types";
import NoteSheet from "../NoteSheet/NoteSheet";
import PianoCheck from "./Check/PianoCheck";

interface PianoProps {
  exerciseConfig: ExerciseConfig;
}

const Piano: React.FC<PianoProps> = ({ exerciseConfig }) => {
  return (
    <PianoProvider exerciseConfig={exerciseConfig}>
      <div className={styles.container}>
        {exerciseConfig.showNoteSheet && exerciseConfig.expectedNotes && (
          <NoteSheet notes={exerciseConfig.expectedNotes} />
        )}
        <PianoOptions />
        <PianoKeys />
        <PianoCheck />
      </div>
    </PianoProvider>
  );
};

export default Piano;
