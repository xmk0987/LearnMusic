// app/lessons/layout.tsx
import React from "react";
import { ExerciseProvider } from "@/context/ExerciseContext";

export default function ExerciseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExerciseProvider>{children}</ExerciseProvider>;
}
