"use client";
import React, { useEffect } from "react";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "./PianoOptions.module.css";
import { usePiano } from "@/context/PianoContext";

export const PianoOptions = () => {
  const {
    isTest,
    playedNotes,
    showLabels,
    showNext,
    showHint,
    showPlayed,
    showKeyboardKeys,
    toggleShowLabels,
    toggleShowHint,
    toggleShowKeyboardKeys,
    toggleShowNext,
    toggleShowPlayed,
    resetNotes,
    handleCheckExercise,
  } = usePiano();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        resetNotes();
      }
      if (e.key === "Enter") {
        handleCheckExercise();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCheckExercise, resetNotes]);

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
        <PrimaryButton
          text={showKeyboardKeys ? "Hide Keyboard Keys" : "Show Keyboard Keys"}
          onClick={toggleShowKeyboardKeys}
        />
      </div>
      <div className={styles.optionsItem}>
        {!isTest && (
          <PrimaryButton
            text={showHint ? "Hide Hint" : "Show Hint"}
            onClick={toggleShowHint}
            color={playedNotes.length === 0 ? "var(--secondary)" : "red"}
          />
        )}
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
