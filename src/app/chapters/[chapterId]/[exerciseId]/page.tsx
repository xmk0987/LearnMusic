"use client";
import React from "react";
import { useExercise } from "@/context/ExerciseContext";
import styles from "./Exercise.module.css";
import ExerciseComponent from "@/components/Exercise/Exercise";

const ExercisePage = () => {
  const { currentExercise, toggleShowHint, showHint, goToChapter, type } =
    useExercise();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>{currentExercise.title}</h1>
          <div className={styles.titleButtons}>
            <button onClick={toggleShowHint}>?</button>
            <button onClick={goToChapter}>X</button>
          </div>
        </div>
      </div>
      <div className={styles.instructions}>
        <p> {currentExercise.task}</p>
        {showHint && <p className={styles.hint}>{currentExercise.tip}</p>}
      </div>
      <ExerciseComponent exercise={currentExercise} isTest={type === "test"}/>
    </div>
  );
};

export default ExercisePage;
