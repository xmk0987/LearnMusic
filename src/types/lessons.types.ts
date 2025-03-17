export interface Exercise {
  id: number;
  name: string;
  notes: string[];
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
