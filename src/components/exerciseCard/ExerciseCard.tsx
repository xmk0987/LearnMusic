"use client";
import React from "react";
import styles from "./ExerciseCard.module.css";
import { useRouter } from "next/navigation";

const ExerciseCard = () => {
  const router = useRouter();

  const goToLessons = (practice: boolean) => {
    const type = practice ? "practice" : "test";
    router.push(`/lessons/scales/b-major?type=${type}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>C Major</div>
      <div className={styles.cardInfo}>
        <div className={styles.cardInfoItem}>
          <span>False</span>
          <p>Completed</p>
        </div>
        <div className={styles.cardInfoItem}>
          <button
            className={styles.circleButton}
            onClick={() => goToLessons(true)}
          >
            &gt;
          </button>
          <p>Practice</p>
        </div>
        <div className={styles.cardInfoItem}>
          <button
            className={`${styles.circleButton} ${styles.test}`}
            onClick={() => goToLessons(false)}
          >
            &gt;
          </button>
          <p>Test</p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
