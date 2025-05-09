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
 * Splits an array into chunks of given size.
 */
const chunkArray = <T,>(array: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );

/**
 * NoteSheet Component
 * Renders a note sheet grid with a fixed-width clef column and dynamic note columns.
 */
const NoteSheet: React.FC<NoteSheetProps> = ({ notes, noteFeedback }) => {
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const parsedNotes = getNoteObjects(notes);

  const STAVE_NOTE_AMOUNT = 10;

  const gridTemplateColumns = `70px repeat(${STAVE_NOTE_AMOUNT}, 1fr)`;

  const staves = chunkArray(parsedNotes, STAVE_NOTE_AMOUNT);

  return (
    <div className={styles.container}>
      <button
        className={styles.showLabels}
        onClick={() => setShowLabels(!showLabels)}
      >
        ?
      </button>
      {staves.map((stave, staveIndex) => {
        return (
          <div
            key={"stave-" + staveIndex}
            className={styles.noteSheet}
            style={{ gridTemplateColumns }}
          >
            {/* Render staff lines on specified grid rows */}
            {staffLines.map((line) => (
              <div
                key={line}
                className={styles.staffLine}
                style={{ gridRow: line }}
              >
                {showLabels && (
                  <span className={styles.staffLineLabel}>{line[0]}</span>
                )}
              </div>
            ))}
            <Clef />
            {stave.map((note: NoteType, noteIndex: number) => {
              const noteKey = `${note.noteName}${note.octave}`;

              const updatedNote = { ...note, position: noteIndex + 2 };

              if (!noteFeedback || Object.keys(noteFeedback).length === 0) {
                return (
                  <Note
                    key={`${updatedNote.noteName}-${updatedNote.position}`}
                    note={updatedNote}
                  />
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
                  key={`${updatedNote.noteName}-${updatedNote.position}`}
                  note={updatedNote}
                  spanStyle={spanStyle}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default NoteSheet;
