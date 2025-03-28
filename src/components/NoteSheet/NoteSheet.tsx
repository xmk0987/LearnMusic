import React from "react";
import styles from "./NoteSheet.module.css";
import Note from "../MusicNotes/Note/Note";
import Clef from "../MusicNotes/Clef/Clef";
import { getNoteObjects } from "@/utils/helpers";
import type { NoteType } from "@/types/piano.types";

const staffLines = ["F5", "D5", "B4", "G4", "E4"];

interface NoteSheetProps {
  notes: string[];
}

/**
 * NoteSheet Component
 * Renders a note sheet grid with a fixed-width clef column and dynamic note columns.
 */
const NoteSheet: React.FC<NoteSheetProps> = ({ notes }) => {
  const parsedNotes = getNoteObjects(notes);

  const gridTemplateColumns = `70px repeat(${parsedNotes.length}, 1fr)`;

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
        {parsedNotes.map((note: NoteType) => (
          <Note key={`${note.noteName}-${note.position}`} note={note} />
        ))}
      </div>
    </div>
  );
};

export default NoteSheet;
