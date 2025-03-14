// LessonDataContext.tsx
"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import lessonsData from "@/lessons/lessons.json";
import { LessonKey, Lessons } from "@/types/lessons.types";

interface LessonDataContextValue {
  lessonContent: Lessons[LessonKey] | null;
  lesson: string;
  valid: boolean;
}

interface LessonDataProvderProps {
  children: React.ReactNode;
}

const LessonDataContext = createContext<LessonDataContextValue | undefined>(
  undefined
);

const validLessons: LessonKey[] = ["scales" /*, "chords" */];

export const LessonDataProvider: React.FC<LessonDataProvderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { lesson } = useParams<{ lesson: LessonKey }>();
  const [lessonContent, setLessonContent] = useState<Lessons[LessonKey] | null>(
    null
  );

  useEffect(() => {
    if (!validLessons.includes(lesson)) {
      router.push("/lessons");
    } else {
      if (!lessonContent) {
        setLessonContent(lessonsData[lesson] as Lessons[LessonKey]);
      }
    }
  }, [lesson, lessonContent, router]);

  return (
    <LessonDataContext.Provider
      value={{ lesson, lessonContent, valid: validLessons.includes(lesson) }}
    >
      {children}
    </LessonDataContext.Provider>
  );
};

export const useLessonData = () => {
  const context = useContext(LessonDataContext);
  if (context === undefined) {
    throw new Error("useLessonData must be used within a LessonDataProvider");
  }
  return context;
};
