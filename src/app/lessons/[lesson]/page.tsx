"use client";
import { useLessonData } from "@/app/context/LessonDataContext";
import ScaleLesson from "@/components/ScaleLesson/ScaleLesson";

const LessonPage = () => {
  const { lesson, lessonContent, valid } = useLessonData();

  if (!valid || !lessonContent) {
    return null;
  }

  if (lesson === "scales" && lessonContent) {
    return <ScaleLesson lessonContent={lessonContent} />;
  }

  return null;
};

export default LessonPage;
