// app/lessons/layout.tsx
import React from "react";
import { LessonsProvider } from "@/context/LessonsProvider";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LessonsProvider>{children}</LessonsProvider>;
}
