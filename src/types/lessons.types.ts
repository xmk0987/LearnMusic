export interface Scale {
  id: number;
  name: string;
  notes: string[];
}

export interface ScalesLessons {
  majors: Scale[];
  minors: Scale[];
}

export interface Lessons {
  scales: ScalesLessons;
}

export type LessonKey = "scales";