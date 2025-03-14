"use client";
import React from "react";
import styles from "./ExerciseCard.module.css";
import { useRouter } from "next/navigation";

interface ExerciseCardProps {
  exerciseName: string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exerciseName }) => {
  const router = useRouter();

  const goToLessons = (practice: boolean) => {
    const type = practice ? "practice" : "test";
    const rawName = exerciseName.replace(/\s+/g, "-").toLowerCase();
    const encodedName = encodeURIComponent(rawName);
    router.push(`/lessons/scales/${encodedName}?type=${type}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.completed}>X</span>
        <p>{exerciseName}</p>
      </div>
      <div className={styles.cardInfo}>
        <button
          className={styles.circleButton}
          onClick={() => goToLessons(true)}
        >
          <span>&gt;</span>
          Practice
        </button>
        <button
          className={`${styles.circleButton} ${styles.test}`}
          onClick={() => goToLessons(false)}
        >
          <span>&gt;</span>
          Test
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
