"use client";
import React, { useEffect } from "react";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "./PianoOptions.module.css";
import { usePiano } from "@/context/PianoContext";

export const PianoOptions = () => {
  const {
    isTest,
    playedNotes,
    uiSettings,
    toggleSetting,
    resetNotes,
    isLastExercise,
    checkResponse,
    goToNextExercise,
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
              text={uiSettings.showLabels ? "Hide Labels" : "Show Labels"}
              onClick={() => toggleSetting("showLabels")}
            />
            <PrimaryButton
              text={
                uiSettings.showNext
                  ? "Hide Show Next Key"
                  : "Show Show Next Key"
              }
              onClick={() => toggleSetting("showNext")}
            />
          </>
        )}
        <PrimaryButton
          text={uiSettings.showPlayed ? "Hide Played" : "Show Played"}
          onClick={() => toggleSetting("showPlayed")}
        />
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
        <PrimaryButton
          text={"Reset Played"}
          onClick={resetNotes}
          color={playedNotes.length === 0 ? "var(--secondary)" : "red"}
          isDisabled={playedNotes.length === 0}
        />
        {checkResponse?.completed ? (
          <PrimaryButton
            text={isLastExercise ? "Go back to lessons" : "Next exercise"}
            onClick={goToNextExercise}
            color="green"
          />
        ) : (
          <PrimaryButton
            text={"Check"}
            onClick={handleCheckExercise}
            isDisabled={playedNotes.length === 0}
            color={playedNotes.length === 0 ? "var(--secondary)" : "green"}
          />
        )}
      </div>
    </div>
  );
};
