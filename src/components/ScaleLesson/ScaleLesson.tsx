import React from "react";
import ExercisesLayout from "@/app/layouts/Exercises/ExercisesLayout";
import styles from "./ScaleLesson.module.css";
import ExerciseCard from "../ExerciseCard/ExerciseCard";
import { Lessons } from "@/types/lessons.types";

interface ScaleLessonProps {
  lessonContent: Lessons["scales"];
}

const ScaleLesson: React.FC<ScaleLessonProps> = ({ lessonContent }) => {
  return (
    <div className={styles.container}>
      <ExercisesLayout title="Major Scales">
        {lessonContent.majors.map((major) => (
          <ExerciseCard key={major.name} exerciseName={major.name} />
        ))}
      </ExercisesLayout>
      <ExercisesLayout title="Minor Scales" hasBreadcrumbs={false}>
        {lessonContent.minors.map((minor) => (
          <ExerciseCard key={minor.name} exerciseName={minor.name} />
        ))}
      </ExercisesLayout>
    </div>
  );
};

export default ScaleLesson;
