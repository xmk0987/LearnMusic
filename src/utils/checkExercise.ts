import type { Key } from "@/types/piano.types";
import type { CheckResponse } from "@/app/lessons/[lessonId]/[exerciseId]/Exercise";
import { calculateExpectedNotesWithOctaves } from "./helpers";
import type { Exercise } from "@/types/lessons.types";

export const checkPlayExercise = (
  exercise: Exercise,
  playedKeys: Key[]
): CheckResponse => {
  if (playedKeys.length === 0) {
    return {
      completed: false,
      message: "You need to play something",
      notes: [],
    };
  }

  const startingOctave = playedKeys[0].octave;
  const expectedNotesWithOctaves = calculateExpectedNotesWithOctaves(
    exercise.notes,
    startingOctave
  );

  // Check each individual note whether its in the scale, wrong position or
  // completely wrong.
  const notesFeedback = playedKeys.map((key, index) => {
    const playedNoteStr = `${key.label}${key.octave}`;
    const expectedNoteStr = expectedNotesWithOctaves[index];

    const correct = playedNoteStr === expectedNoteStr;

    const isWrongPosition =
      exercise.notes.includes(key.label) &&
      index <= exercise.notes.length - 1 &&
      !correct;

    const status: "correct" | "wrongPosition" | "wrong" = correct
      ? "correct"
      : isWrongPosition
      ? "wrongPosition"
      : "wrong";

    return {
      note: key.label,
      octave: key.octave,
      status,
    };
  });

  // Create a descriptive message based on error or success
  const isTooMany = notesFeedback.length > exercise.notes.length;

  const isTooLittle = notesFeedback.length < exercise.notes.length;

  const completed =
    notesFeedback.every((note) => note.status === "correct") &&
    notesFeedback.length === expectedNotesWithOctaves.length;

  const message = completed
    ? "CORRECT!"
    : isTooMany
    ? "You have too many notes"
    : isTooLittle
    ? "You didn't select enough notes"
    : "Some notes are not correct!";

  return { completed, message, notes: notesFeedback };
};
