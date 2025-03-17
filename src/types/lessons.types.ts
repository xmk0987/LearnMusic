export interface Exercise {
  id: number;
  name: string;
  description?: string;
  notes: string[];
}

export interface Lesson {
  id: number;
  name: string;
  description?: string;
  category: LessonCategory;
  type?: LessonTypes;
  exercises: Exercise[];
}

export type LessonTypes = "Major" | "Minor" | "Chords";

export type LessonCategory = "scales";
export interface Lessons {
  lessons: Lesson[];
}
