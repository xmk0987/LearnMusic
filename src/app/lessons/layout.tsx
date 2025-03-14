// app/lessons/layout.tsx
import React from "react";
import { LessonDataProvider } from "../context/LessonDataContext";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LessonDataProvider>{children}</LessonDataProvider>;
}
