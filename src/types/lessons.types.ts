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
  lesson?: string;
  task: string;
  category: LessonCategory;
  type: LessonTypes;
  exercises: Exercise[];
}

export interface GroupedLessons {
  scales?: Lesson[] | undefined;
  chords?: Lesson[] | undefined;
}

export type LessonTypes = "play" | "read" | "transcribe";

export type LessonCategory = "scales" | "chords";
export interface Lessons {
  lessons: Lesson[];
}

