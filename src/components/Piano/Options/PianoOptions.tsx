"use client";
import React from "react";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "./PianoOptions.module.css";
import { usePiano } from "@/context/PianoContext";

export const PianoOptions = () => {
  const {
    isTest,
    playedNotes,
    showLabels,
    showNext,
    showPlayed,
    toggleShowLabels,
    toggleShowNext,
    toggleShowPlayed,
    resetNotes,
    handleCheckExercise,
  } = usePiano();

  return (
    <div className={styles.options}>
      <div className={styles.optionsItem}>
        {!isTest && (
          <>
            <PrimaryButton
              text={showLabels ? "Hide Labels" : "Show Labels"}
              onClick={toggleShowLabels}
            />
            <PrimaryButton
              text={showNext ? "Hide Show Next Key" : "Show Show Next Key"}
              onClick={toggleShowNext}
            />
          </>
        )}
        <PrimaryButton
          text={showPlayed ? "Hide Played" : "Show Played"}
          onClick={toggleShowPlayed}
        />
      </div>
      <div className={styles.optionsItem}>
        <PrimaryButton
          text={"Reset Played"}
          onClick={resetNotes}
          color={playedNotes.length === 0 ? "var(--secondary)" : "red"}
          isDisabled={playedNotes.length === 0}
        />
        <PrimaryButton
          text={"Check"}
          onClick={handleCheckExercise}
          color={playedNotes.length === 0 ? "var(--secondary)" : "green"}
        />
      </div>
    </div>
  );
};
