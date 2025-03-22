"use client";
import React from "react";
import LessonCard from "@/components/GridCards/Lesson/LessonCard";
import CardGridLayout from "../layouts/CardGrid/CardGridLayout";
import { useLessonsData } from "@/context/LessonsContext";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs/DynamicBreadcrumbs";
import { LessonCategory } from "@/types/lessons.types";
import styles from "./LessonsPage.module.css";
import { capitalizeFirstLetter } from "@/utils/helpers";

const LessonsPage = () => {
  const { groupedLessons } = useLessonsData();

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
