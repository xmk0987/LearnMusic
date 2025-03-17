// app/lessons/layout.tsx
import React from "react";
import { LessonsProvider } from "@/context/LessonsContext";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LessonsProvider>{children}</LessonsProvider>;
}
