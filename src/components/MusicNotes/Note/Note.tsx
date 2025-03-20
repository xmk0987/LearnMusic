import React, { useMemo } from "react";
import styles from "../Note.module.css";
import type { NoteType } from "@/types/lessons.types";
import { usePiano } from "@/context/PianoContext";
import { calculateExpectedNotesWithOctaves } from "@/utils/helpers";
import { CheckResponseNote } from "@/context/ExerciseContext";

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
  const { playedNotes, currentExercise, checkResponse } = usePiano();

  // Determine accidental information
  const isSharp = note.noteName.includes("#");
  const isFlat = note.noteName.includes("b");

  // Remove accidental from note name (assumes only one accidental)
  const noteLetter = note.noteName.replace(/[#b]/, "");
  const noteCombo = `${noteLetter}${note.octave}`;
  const needLine = noteCombo === "C4" || noteCombo === "B5";

  // Memoize expected notes based on currentExercise
  const expectedNotes = useMemo(
    () => calculateExpectedNotesWithOctaves(currentExercise.notes, 4),
    [currentExercise.notes]
  );

  // Memoize note matching and status feedback
  const { noteIsNextKey, noteStatus } = useMemo(() => {
    const noteIsNextKey = expectedNotes[playedNotes.length] === note.value;
    const noteFeedback = checkResponse?.notes.find(
      (feedback: CheckResponseNote) =>
        `${feedback.note}${feedback.octave}` === note.value
    );
    const noteStatus = noteFeedback?.status === "correct" ? "correct" : "wrong";
    return { noteIsNextKey, noteStatus };
  }, [expectedNotes, playedNotes.length, note.value, checkResponse]);

  // Apply feedback class if checkResponse exists and noteStatus is defined.
  const feedbackClass =
    checkResponse && noteStatus
      ? styles[noteStatus]
      : noteIsNextKey
      ? styles["nextKey"]
      : "";

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
        <span className={`${styles.sharp} ${feedbackClass}`}>
          {accidentalSymbol}
        </span>
      )}
      <span className={`${styles.note} ${feedbackClass}`}>
        {NOTE_MAPPING[noteLength]}
        {needLine && <span className={styles.noteLine}></span>}
      </span>
    </div>
  );
};

export default React.memo(Note);
