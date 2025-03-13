"use client";
import React from "react";
import styles from "./ExerciseCard.module.css";
import { useRouter } from "next/navigation";

const ExerciseCard = () => {
  const router = useRouter();

  const goToLessons = () => {
    router.push("/lessons/scales/c-major");
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>C Major</div>
      <div className={styles.cardInfo}>
        <div className={styles.cardInfoItem}>
          <button className={styles.circleButton} onClick={goToLessons}>
            &gt;
          </button>
          <span>False</span>
          <p>Completed</p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
