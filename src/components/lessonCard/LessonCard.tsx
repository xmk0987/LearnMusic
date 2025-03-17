"use client";
import React from "react";
import styles from "./LessonCard.module.css";
import { useRouter } from "next/navigation";
import { Lesson } from "@/types/lessons.types";

interface LessonCardProps {
  lesson: Lesson;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const router = useRouter();

  const goToLessons = () => {
    router.push("/lessons/" + lesson.id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>{lesson.name}</div>
      <div className={styles.cardInfo}>
        <div className={styles.cardInfoItem}>
          <button className={styles.circleButton} onClick={goToLessons}>
            &gt;
          </button>
          <span>{lesson.exercises.length}</span>
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
