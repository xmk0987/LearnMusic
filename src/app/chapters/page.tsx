"use client";
import React from "react";
import CardGridLayout from "../../layouts/CardGrid/CardGridLayout";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs/DynamicBreadcrumbs";
import styles from "./LessonsPage.module.css";
import { useChaptersData } from "@/context/ChaptersContext";
import ChapterCard from "@/components/GridCards/Chapter/ChapterCard";

const ChaptersPage = () => {
  const { chapters } = useChaptersData();

  if (!chapters) return <p>Loading chapters</p>;
  return (
    <div className={styles.container}>
      <div>
        <h1>Chapters</h1>
        <DynamicBreadcrumbs />
      </div>
      {Object.keys(chapters).map((chapter) => (
        <CardGridLayout key={chapter}>
          {chapters.map((chapter) => (
            <ChapterCard key={chapter._id} chapter={chapter} />
          ))}
        </CardGridLayout>
      ))}
    </div>
  );
};

export default ChaptersPage;
