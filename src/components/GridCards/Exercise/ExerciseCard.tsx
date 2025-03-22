"use client";
import React from "react";
import styles from "./ExerciseCard.module.css";
import { Exercise } from "@/types/lessons.types";
import { GoIcon } from "@/assets/icons";

interface ExerciseCardProps {
  exercise: Exercise;
  goToExercise: (exerciseId: number, type: "test" | "practice") => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  goToExercise,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.completed}>X</span>
        <p>{exercise.name}</p>
      </div>
      <div className={styles.cardInfo}>
        <button
          className={styles.circleButton}
          onClick={() => goToExercise(exercise.id, "practice")}
        >
          <span>
            <GoIcon color="white" />
          </span>
          Practice
        </button>
        <button
          className={`${styles.circleButton} ${styles.test}`}
          onClick={() => goToExercise(exercise.id, "test")}
        >
          <span>
            <GoIcon color="white" />
          </span>
          Test
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
