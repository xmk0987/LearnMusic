import React from "react";
import styles from "./ScaleExercise.module.css";

interface ScaleExerciseProps {
  exercise: string;
}

const ScaleExercise: React.FC<ScaleExerciseProps> = ({ exercise }) => {
  return <div className={styles.container}>ScaleExercise - {exercise}</div>;
};

export default ScaleExercise;
