"use client";
import React from "react";
import styles from "./LessonCard.module.css";
import { useRouter } from "next/navigation";

const LessonCard = () => {
  const router = useRouter();

  const goToLessons = () => {
    router.push("/lessons/scales");
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Basic Scales</div>
      <div className={styles.cardInfo}>
        <div className={styles.cardInfoItem}>
          <button className={styles.circleButton} onClick={goToLessons}>
            &gt;
          </button>{" "}
          <span>24</span>
          <p>Exercises</p>
        </div>
        <div className={styles.cardInfoItem}>
          <span>0</span>
          <p>Completed</p>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
