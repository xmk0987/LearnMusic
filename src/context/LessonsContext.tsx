"use client";
import { useEffect, useState, createContext, useContext, useMemo } from "react";
import { useParams } from "next/navigation";
import lessonsData from "@/lessons/lessons.json";
import type {
  Lesson,
  LessonCategory,
  GroupedLessons,
} from "@/types/lessons.types";

interface LessonsContextValue {
  lessons: Lesson[];
  currentLesson: Lesson | undefined;
  groupedLessons: GroupedLessons;
}
interface LessonsProviderProps {
  children: React.ReactNode;
}

const LessonsContext = createContext<LessonsContextValue | undefined>(
  undefined
);

export const LessonsProvider: React.FC<LessonsProviderProps> = ({
  children,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { lessonId } = useParams<{ lessonId: string }>();

  useEffect(() => {
    setLessons(lessonsData.lessons as Lesson[]);
    setLoading(false);
  }, []);

  const groupedLessons = useMemo(() => {
    return lessons.reduce((acc, lesson) => {
      (acc[lesson.category] = acc[lesson.category] || []).push(lesson);
      return acc;
    }, {} as { [key in LessonCategory]?: Lesson[] });
  }, [lessons]);

  useEffect(() => {
    if (lessonId) {
      setLoading(true);
      const foundLesson = lessons.find((l) => l.id === parseInt(lessonId));
      setCurrentLesson(foundLesson);
      if (foundLesson) {
        setCurrentLesson(foundLesson);
        setError(null);
      } else {
        setError("Lesson not found");
      }
      setLoading(false);
    }
  }, [lessonId, lessons]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error || "Lesson not found"}</h1>;
  }

  return (
    <LessonsContext.Provider value={{ lessons, currentLesson, groupedLessons }}>
      {children}
    </LessonsContext.Provider>
  );
};

export const useLessonsData = () => {
  const context = useContext(LessonsContext);
  if (context === undefined) {
    throw new Error("useLessonsData must be used within a LessonsProvider");
  }
  return context;
};
