"use client";
import { useEffect, useState, createContext, useContext } from "react";
import lessonsData from "@/lessons/lessons.json";
import { Lesson } from "@/types/lessons.types";

interface LessonsContextValue {
  lessons: Lesson[];
  getLessonById: (id: number) => Lesson | undefined;
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

  useEffect(() => {
    setLessons(lessonsData.lessons as Lesson[]);
  }, []);

  const getLessonById = (id: number): Lesson | undefined => {
    return lessons.find((lesson) => lesson.id === id);
  };

  return (
    <LessonsContext.Provider value={{ lessons, getLessonById }}>
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
