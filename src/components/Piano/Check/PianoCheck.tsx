import React from "react";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "./PianoCheck.module.css";
import { usePiano } from "@/context/PianoContext";
import PianoColorLabels from "./PianoColorLabels";
import { useExercise } from "@/context/ExerciseContext";

const PianoCheck = () => {
  const { exerciseConfig, uiSettings, toggleSetting } = usePiano();
  const { isLastExercise, goToNextExercise } = useExercise();

  if (
    !(
      exerciseConfig.exercise.type === "play_scale" &&
      exerciseConfig.exerciseFinished &&
      exerciseConfig.exerciseFeedback
    )
  )
    return null;

  return (
    <>
      {uiSettings.showCheckModal ? (
        <div
          className="modalOverlay"
          onClick={() => toggleSetting("showCheckModal")}
        >
          <div className="modalContent">
            <p className={styles.message}>
              {exerciseConfig.exerciseFeedback.message}
            </p>
            <div className={styles.buttons}>
              <PrimaryButton
                text={"Try again"}
                onClick={exerciseConfig.resetExercise}
                color="red"
              />
              {exerciseConfig.exerciseFeedback.allCorrect && (
                <PrimaryButton
                  text={
                    isLastExercise ? "Go to chapter" : "Go to next exercise"
                  }
                  onClick={goToNextExercise}
                  color={"green"}
                />
              )}
            </div>
            <PianoColorLabels />
          </div>
        </div>
      ) : (
        <PianoColorLabels />
      )}
    </>
  );
};

export default PianoCheck;
