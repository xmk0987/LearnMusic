import React from "react";
import styles from "../Note.module.css";

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

export type NoteValue =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B";

interface NoteProps {
  note: NoteValue;
  octave?: 4 | 5;
  sharp?: boolean;
  flat?: boolean;
  notePosition: number;
  noteLength?: "q" | "e" | "be" | "bs";
}

const Note: React.FC<NoteProps> = ({
  note,
  octave = 4,
  sharp = false,
  flat = false,
  notePosition,
  noteLength = "q",
}) => {
  const noteCombo = `${note}${octave}`;
  const needLine = noteCombo === "C4" || noteCombo === "B5";
  return (
    <div
      className={styles.noteContainer}
      style={{ gridRow: `${note}${octave}`, gridColumn: notePosition }}
    >
      <span className={styles.sharp}>
        {flat && NOTE_MAPPING["flat"]}
        {sharp && NOTE_MAPPING["sharp"]}
      </span>
      <span className={styles.note}>
        {NOTE_MAPPING[noteLength]}
        {needLine && <span className={styles.noteLine}></span>}
      </span>
    </div>
  );
};

export default Note;
