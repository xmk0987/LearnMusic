"use client";
import React, { useState } from "react";
import styles from "./ExercisesLayout.module.css";
import ChecvronRightIcon from "@/assets/icons/ChevronRightIcon";
import { ChevronDownIcon } from "@/assets/icons";

interface ExercisesLayout {
  children: React.ReactNode;
}

const ExercisesLayout: React.FC<ExercisesLayout> = ({ children }) => {
  const [showContent, setShowContent] = useState<boolean>(true);

  return (
    <div className={styles.container}>
      <button
        className={styles.exercisesHeader}
        onClick={() => setShowContent(!showContent)}
      >
        Exercises
        {showContent ? <ChevronDownIcon /> : <ChecvronRightIcon />}
      </button>
      {showContent && <div className={styles.exercises}>{children}</div>}
    </div>
  );
};

export default ExercisesLayout;
