"use client";
import React from "react";
import LessonCard from "@/components/LessonCard/LessonCard";
import CardGridLayout from "../layouts/CardGrid/CardGridLayout";
import { useLessonsData } from "@/context/LessonsProvider";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs/DynamicBreadcrumbs";
import { LessonCategory, Lesson } from "@/types/lessons.types";
import styles from "./LessonsPage.module.css";
import { capitalizeFirstLetter } from "@/utils/helpers";

const LessonsPage = () => {
  const { lessons } = useLessonsData();

  // Define the type for groupedLessons
  const groupedLessons: { [key in LessonCategory]?: Lesson[] } = lessons.reduce(
    (acc, lesson) => {
      (acc[lesson.category] = acc[lesson.category] || []).push(lesson);
      return acc;
    },
    {} as { [key in LessonCategory]?: Lesson[] }
  );

  return (
    <div className={styles.container}>
      <div>
        <h1>Lessons</h1>
        <DynamicBreadcrumbs />
      </div>
      {Object.keys(groupedLessons).map((category) => (
        <CardGridLayout key={category} title={capitalizeFirstLetter(category)}>
          {groupedLessons[category as LessonCategory]?.map((lesson) => (
            <LessonCard key={lesson.name} lesson={lesson} />
          ))}
        </CardGridLayout>
      ))}
    </div>
  );
};

export default LessonsPage;
