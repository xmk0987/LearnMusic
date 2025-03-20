import React from "react";
import styles from "./NoteSheet.module.css";
import Note from "../MusicNotes/Note/Note";
import Clef from "../MusicNotes/Clef/Clef";
import { usePiano } from "@/context/PianoContext";

// Define which grid rows (by name) should have a staff line
const staffLines = ["F5", "D5", "B4", "G4", "E4"];

/**
 * NoteSheet Component
 * Renders a note sheet grid with staff lines and notes.
 */
const NoteSheet = () => {
  const { currentExercise } = usePiano();

  return (
    <div className={styles.container}>
      <div className={styles.noteSheet}>
        {staffLines.map((line) => (
          <div
            key={line}
            className={styles.staffLine}
            style={{ gridRow: line }}
          />
        ))}
        <Clef />

        <Note note="C" octave={4} flat notePosition={2} />
      </div>
    </div>
  );
};

export default NoteSheet;
