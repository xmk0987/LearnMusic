import React from "react";
import styles from "./NoteSheet.module.css";
import Note from "../MusicNotes/Note/Note";
import Clef from "../MusicNotes/Clef/Clef";
import { usePiano } from "@/context/PianoContext";
import { getNoteObjects } from "@/utils/helpers";
import type { NoteType } from "@/types/lessons.types";

const staffLines = ["F5", "D5", "B4", "G4", "E4"];

/**
 * NoteSheet Component
 * Renders a note sheet grid with a fixed-width clef column and dynamic note columns.
 */
const NoteSheet = () => {
  // Retrieve the current exercise data from the context.
  const { currentExercise } = usePiano();

  // Generate note objects based on the exercise's notes and flat settings.
  const notes = getNoteObjects(currentExercise.notes, currentExercise.useFlats);

  // Define grid columns with a fixed 50px for the clef, followed by one 1fr column per note.
  const gridTemplateColumns = `70px repeat(${notes.length}, 1fr)`;

  return (
    <div className={styles.container}>
      <div className={styles.noteSheet} style={{ gridTemplateColumns }}>
        {/* Render staff lines on specified grid rows */}
        {staffLines.map((line) => (
          <div
            key={line}
            className={styles.staffLine}
            style={{ gridRow: line }}
          />
        ))}
        <Clef />
        {notes.map((note: NoteType) => (
          <Note key={`${note.noteName}-${note.position}`} note={note} />
        ))}
      </div>
    </div>
  );
};

export default NoteSheet;
