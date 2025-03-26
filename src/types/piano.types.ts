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

export type NoteFeedback = {
  [note: string]: "correct" | "wrong" | null;
};

export interface ExerciseConfig {
  exercise: PlayNotesExercise | ScaleExercise;
  isTest: boolean;
  handleKeyClick: (key: Key) => void;
  noteFeedback?: NoteFeedback | null;
  exerciseFinished: boolean;
  resetExercise: () => void;
}
