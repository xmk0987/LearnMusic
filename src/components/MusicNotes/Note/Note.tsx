import React from "react";
import styles from "../Note.module.css";
import type { NoteType } from "@/types/piano.types";

const NOTE_MAPPING = {
  q: "♩",
  e: "♪",
  be: "♫",
  bs: "♬",
  flat: "♭",
  sharp: "♯",
  clef: "𝄞",
  fclef: "𝄢",
  repeat: "𝄇",
  bar: "𝄀",
};

interface NoteProps {
  note: NoteType;
  noteLength?: "q" | "e" | "be" | "bs";
}

const Note: React.FC<NoteProps> = ({ note, noteLength = "q" }) => {
  // Determine accidental information
  const isSharp = note.noteName.includes("#");
  const isFlat = note.noteName.includes("b");

  // Remove accidental from note name (assumes only one accidental)
  const noteLetter = note.noteName.replace(/[#b]/, "");
  const noteCombo = `${noteLetter}${note.octave}`;
  const needLine = noteCombo === "C4" || noteCombo === "B5";

  // Determine accidental symbol if present
  const accidentalSymbol = isFlat
    ? NOTE_MAPPING.flat
    : isSharp
    ? NOTE_MAPPING.sharp
    : "";

  return (
    <div
      className={`${styles.noteContainer}`}
      style={{
        gridRow: noteCombo,
        gridColumn: note.position,
      }}
    >
      {accidentalSymbol && (
        <span className={`${styles.sharp} `}>{accidentalSymbol}</span>
      )}
      <span className={`${styles.note} `}>
        {NOTE_MAPPING[noteLength]}
        {needLine && <span className={styles.noteLine}></span>}
      </span>
    </div>
  );
};

export default React.memo(Note);
