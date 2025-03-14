"use client";
import React, { useState } from "react";
import styles from "./ExercisesLayout.module.css";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs/DynamicBreadcrumbs";

interface ExercisesLayout {
  title: string;
  children: React.ReactNode;
  hasBreadcrumbs?: boolean;
}

const ExercisesLayout: React.FC<ExercisesLayout> = ({
  title,
  children,
  hasBreadcrumbs = true,
}) => {
  const [showContent, setShowContent] = useState<boolean>(true);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerItem}>
          <h1 className={styles.title}>{title}</h1>
          {hasBreadcrumbs && <DynamicBreadcrumbs />}
        </div>
        <button
          className={styles.headerButton}
          onClick={() => setShowContent(!showContent)}
        >
          {showContent ? "Hide" : "Expand"}
        </button>
      </div>
      {showContent && <div className={styles.exercises}>{children}</div>}
    </div>
  );
};

export default ExercisesLayout;
