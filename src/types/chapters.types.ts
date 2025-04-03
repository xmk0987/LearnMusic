import { NoteValue } from "./piano.types";

export interface Chapter {
  _id: string;
  name: string;
  lesson: Lesson;
}

export interface Lesson {
  header: string;
  sections: Section[];
}

export interface Section {
  title: string;
  content: string;
  subsections?: SubSection[];
  exercises: Exercise[];
}

export interface SubSection {
  title: string;
  content: string;
}

export type Exercise = ScaleExercise | PlayNotesExercise;

export interface BaseExercise {
  _id: string;
  title: string;
  type: ExerciseTypes;
  task: string;
  tip?: string;
}

export interface ScaleExercise extends BaseExercise {
  type: "play_scale" | "identify_scales" | "identify_scales_accidentals";
  scale: Scale;
}

export interface PlayNotesExercise extends BaseExercise {
  type: "play_single_note" | "play_single_note_stave";
  notes: NoteValue[];
}

export type ExerciseTypes =
  | "play_scale"
  | "play_single_note"
  | "play_single_note_stave"
  | "identify_scales"
  | "identify_scales_accidentals";

export type PracticeType = "test" | "practice";
export interface Scale {
  _id: string;
  name: string;
  notes: NoteValue[];
}
