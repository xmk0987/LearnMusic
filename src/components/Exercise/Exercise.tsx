import React from "react";
import { Exercise } from "@/types/chapters.types";
import PlayScaleExercise from "./Exercises/PlayScaleExercise";
import PlayNoteExercise from "./Exercises/PlayNoteExercise";
import IdentifyScalesExercise from "./Exercises/IdentifyScalesExercise";

interface ExerciseComponentProps {
  exercise: Exercise;
  isTest: boolean;
}

const ExerciseComponent: React.FC<ExerciseComponentProps> = ({
  exercise,
  isTest,
}) => {
  switch (exercise.type) {
    case "play_scale":
      return <PlayScaleExercise exercise={exercise} isTest={isTest} />;
    case "play_single_note":
      return <PlayNoteExercise exercise={exercise} isTest={isTest} />;
    case "identify_scales":
    case "identify_scales_accidentals":
      return <IdentifyScalesExercise exercise={exercise} />;
    default:
      return null;
  }
};

export default ExerciseComponent;
