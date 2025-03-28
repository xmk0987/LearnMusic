import type { PlayNotesExercise, ScaleExercise } from "./chapters.types";

export type KeyType = "white" | "black";

export interface Key {
  type: KeyType;
  value: string[];
  label: string;
  octave: number;
  midiKey: number;
  keyboardKey: string;
}

export interface ExerciseFeedback {
  message?: string;
  allCorrect: boolean;
  notes: NoteFeedback;
}

export type NoteFeedback = {
  [note: string]: "correct" | "wrong" | "wrongPosition" | null;
};

export interface ExerciseConfig {
  exercise: PlayNotesExercise | ScaleExercise;
  isTest: boolean;
  exerciseFeedback?: ExerciseFeedback | null;
  exerciseFinished: boolean;
  playedNotes?: Key[];
  expectedNotes?: string[];
  handleKeyClick?: (key: Key) => void;
  resetExercise: () => void;
  checkExercise?: () => void;
}

export type NoteValue =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "E#"
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

export interface NoteType {
  noteName: NoteValue;
  octave: number;
  position: number;
  value: string;
  index: number;
}
