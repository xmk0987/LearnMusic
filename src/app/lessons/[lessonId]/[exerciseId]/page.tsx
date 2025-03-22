"use client";
import React from "react";
import { useExercise } from "@/context/ExerciseContext";
import styles from "./Exercise.module.css";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs/DynamicBreadcrumbs";
import Piano from "@/components/Piano/Piano";
import { capitalizeFirstLetter } from "@/utils/helpers";

const ExercisePage = () => {
  const {
    currentExercise,
    currentLesson,
    toggleShowHint,
    showHint,
    type,
    goToLesson,
  } = useExercise();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>
            {currentExercise.name} - {capitalizeFirstLetter(type)}
          </h1>
          <div className={styles.titleButtons}>
            <button onClick={toggleShowHint}>?</button>
            <button onClick={goToLesson}>X</button>
          </div>
        </div>
        <DynamicBreadcrumbs
          lessonName={currentLesson.name}
          exerciseName={currentExercise.name}
        />
      </div>
      <div className={styles.instructions}>
        <p> {currentLesson.task}</p>
        {showHint && <p className={styles.hint}>{currentLesson.hint}</p>}
      </div>
      <Piano />
    </div>
  );
};

export default ExercisePage;
