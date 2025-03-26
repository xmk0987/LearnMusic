"use client";
import React from "react";
import styles from "./ChapterCard.module.css";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import type { Chapter } from "@/types/chapters.types";

interface ChapterCardProps {
  chapter: Chapter;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  const router = useRouter();

  const goToChapter = () => {
    router.push("/chapters/" + chapter.id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {chapter.name}
        <span>{chapter.lesson.header}</span>
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.cardInfoItem}>
          <span>{chapter.lesson.sections.length}</span>
          <p>Sections</p>
        </div>
        <div className={styles.cardInfoItem}>
          <span>0</span>
          <p>Completed</p>
        </div>
      </div>
      <PrimaryButton text="Lets Learn!" onClick={goToChapter} />
    </div>
  );
};

export default ChapterCard;
