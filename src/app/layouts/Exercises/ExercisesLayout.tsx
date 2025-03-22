"use client";
import React, { useState } from "react";
import styles from "./ExercisesLayout.module.css";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs/DynamicBreadcrumbs";
import ChecvronRightIcon from "@/assets/icons/ChevronRightIcon";
import { ChevronDownIcon } from "@/assets/icons";
import { useLessonsData } from "@/context/LessonsContext";

interface ExercisesLayout {
  children: React.ReactNode;
}

const ExercisesLayout: React.FC<ExercisesLayout> = ({ children }) => {
  const { currentLesson } = useLessonsData();
  const [showContent, setShowContent] = useState<boolean>(true);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{currentLesson?.name}</h1>
        <DynamicBreadcrumbs lessonName={currentLesson?.name} />
      </div>
      <p className={styles.lesson}>{currentLesson?.lesson}</p>
      <button
        className={styles.exercisesHeader}
        onClick={() => setShowContent(!showContent)}
      >
        Exercises
        {showContent ? <ChevronDownIcon /> : <ChecvronRightIcon />}
      </button>
      {showContent && <div className={styles.exercises}>{children}</div>}
    </div>
  );
};

export default ExercisesLayout;
