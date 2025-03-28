"use client";
import React, { useEffect } from "react";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "./PianoOptions.module.css";
import { usePiano } from "@/context/PianoContext";
import { useExercise } from "@/context/ExerciseContext";

export const PianoOptions = () => {
  const {
    isTest,
    uiSettings,
    toggleSetting,
    handleCheckExercise,
    exerciseType,
    exerciseConfig,
  } = usePiano();
  const { isLastExercise, goToNextExercise } = useExercise();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        exerciseConfig.resetExercise();
      }
      if (e.key === "Enter") {
        handleCheckExercise();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [exerciseConfig, handleCheckExercise]);

  return (
    <div className={styles.options}>
      <div className={styles.optionsItem}>
        {!isTest && (
          <>
            <PrimaryButton
              text={uiSettings.showLabels ? "Hide Labels" : "Show Labels"}
              onClick={() => toggleSetting("showLabels")}
            />
            {exerciseType === "play_scale" && (
              <PrimaryButton
                text={
                  uiSettings.showNext
                    ? "Hide Show Next Key"
                    : "Show Show Next Key"
                }
                onClick={() => toggleSetting("showNext")}
              />
            )}
          </>
        )}
        {exerciseType === "play_scale" && (
          <PrimaryButton
            text={uiSettings.showPlayed ? "Hide Played" : "Show Played"}
            onClick={() => toggleSetting("showPlayed")}
          />
        )}
        <PrimaryButton
          text={
            uiSettings.showKeyboardKeys
              ? "Hide Keyboard Keys"
              : "Show Keyboard Keys"
          }
          onClick={() => toggleSetting("showKeyboardKeys")}
        />
      </div>
      <div className={styles.optionsItem}>
        {exerciseConfig.exercise.type === "play_scale" && (
          <>
            <PrimaryButton
              text={
                exerciseConfig.exerciseFinished ? "Try again" : "Reset Played"
              }
              onClick={() => exerciseConfig.resetExercise()}
              color={
                exerciseConfig.playedNotes?.length === 0
                  ? "var(--secondary)"
                  : "red"
              }
              isDisabled={exerciseConfig.playedNotes?.length === 0}
            />
            {exerciseConfig.exerciseFinished &&
            exerciseConfig.exerciseFeedback?.allCorrect ? (
              <PrimaryButton
                text={isLastExercise ? "Go to chapter" : "Go to next exercise"}
                onClick={goToNextExercise}
                color={
                  exerciseConfig.playedNotes?.length === 0
                    ? "var(--secondary)"
                    : "green"
                }
              />
            ) : !exerciseConfig.exerciseFinished ? (
              <PrimaryButton
                text={"Check"}
                onClick={handleCheckExercise}
                isDisabled={exerciseConfig.playedNotes?.length === 0}
                color={
                  exerciseConfig.playedNotes?.length === 0
                    ? "var(--secondary)"
                    : "green"
                }
              />
            ) : null}
          </>
        )}
        {exerciseConfig.exercise.type === "play_single_note" &&
          exerciseConfig.exerciseFinished && (
            <>
              <PrimaryButton
                text={
                  exerciseConfig.exerciseFinished ? "Try again" : "Reset Played"
                }
                onClick={() => exerciseConfig.resetExercise()}
                color={
                  exerciseConfig.playedNotes?.length === 0
                    ? "var(--secondary)"
                    : "red"
                }
              />
              <PrimaryButton
                text={isLastExercise ? "Go to chapter" : "Go to next exercise"}
                onClick={goToNextExercise}
                color={
                  exerciseConfig.playedNotes?.length === 0
                    ? "var(--secondary)"
                    : "green"
                }
              />
            </>
          )}
      </div>
    </div>
  );
};
