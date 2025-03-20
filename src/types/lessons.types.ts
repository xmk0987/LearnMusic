export interface Exercise {
  id: number;
  name: string;
  notes: string[];
  useFlats?: boolean;
}

export interface Lesson {
  id: number;
  name: string;
  description?: string;
  hint: string;
  task: string;
  category: LessonCategory;
  type: LessonTypes;
  exercises: Exercise[];
}

export type LessonTypes = "play" | "read" | "transcribe";

export type LessonCategory = "scales" | "chords";
export interface Lessons {
  lessons: Lesson[];
}

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

export interface NoteType {
  noteName: NoteValue;
  octave: number;
  position: number;
  value: string;
  index: number;
}
