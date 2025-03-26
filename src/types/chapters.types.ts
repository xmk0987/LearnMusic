export interface Chapter {
  id: string;
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
  subsections?: Section[];
  exercises: Exercise[];
}

export type Exercise = ScaleExercise | PlayNotesExercise;

export interface BaseExercise {
  id: string;
  title: string;
  type: ExerciseTypes;
  task: string;
  tip?: string;
}

export interface ScaleExercise extends BaseExercise {
  type: "play_scale" | "identify_scales" | "identify_scales_accidentals";
  scaleId: string;
}

export interface PlayNotesExercise extends BaseExercise {
  type: "play_single_note";
  notes: string[];
}

export type ExerciseTypes =
  | "play_scale"
  | "play_single_note"
  | "identify_scales"
  | "identify_scales_accidentals";

export type PracticeType = "test" | "practice";
