import React, { useState } from "react";
import styles from "./NoteSheet.module.css";
import Note from "../MusicNotes/Note/Note";
import Clef from "../MusicNotes/Clef/Clef";
import { getNoteObjects } from "@/utils/helpers";
import type { NoteFeedback, NoteType } from "@/types/piano.types";

const staffLines = ["F5", "D5", "B4", "G4", "E4"];

interface NoteSheetProps {
  notes: string[];
  noteFeedback?: NoteFeedback;
}

/**
 * NoteSheet Component
 * Renders a note sheet grid with a fixed-width clef column and dynamic note columns.
 */
const NoteSheet: React.FC<NoteSheetProps> = ({ notes, noteFeedback }) => {
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const parsedNotes = getNoteObjects(notes);

  const gridTemplateColumns = `70px repeat(${parsedNotes.length}, 1fr)`;

  return (
    <div className={styles.container}>
      <button
        className={styles.showLabels}
        onClick={() => setShowLabels(!showLabels)}
      >
        ?
      </button>
      <div className={styles.noteSheet} style={{ gridTemplateColumns }}>
        {/* Render staff lines on specified grid rows */}
        {staffLines.map((line) => (
          <>
            <div
              key={line}
              className={styles.staffLine}
              style={{ gridRow: line }}
            >
              {showLabels && (
                <span className={styles.staffLineLabel}>{line[0]}</span>
              )}
            </div>
          </>
        ))}
        <Clef />
        {parsedNotes.map((note: NoteType) => {
          const noteKey = `${note.noteName}${note.octave}`;

          if (!noteFeedback || Object.keys(noteFeedback).length === 0) {
            return (
              <Note key={`${note.noteName}-${note.position}`} note={note} />
            );
          }

          const spanStyle =
            noteFeedback[noteKey] === "correct"
              ? "correct"
              : noteFeedback[noteKey] === "wrong"
              ? "wrong"
              : "wrong";

          return (
            <Note
              key={`${note.noteName}-${note.position}`}
              note={note}
              spanStyle={spanStyle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NoteSheet;
