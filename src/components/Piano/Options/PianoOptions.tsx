"use client";
import React from "react";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "./PianoOptions.module.css";
import { Key } from "@/types/piano.types";

interface PianoOptionsProps {
  isTest: boolean;
  showLabels: boolean;
  showPlayed: boolean;
  playedNotes: Key[];
  setShowLabels: (value: boolean) => void;
  setShowPlayed: (value: boolean) => void;
  resetNotes: () => void;
  handleCheckExercise: () => void;
}

export const PianoOptions: React.FC<PianoOptionsProps> = ({
  isTest,
  showLabels,
  setShowLabels,
  showPlayed,
  playedNotes,
  setShowPlayed,
  resetNotes,
  handleCheckExercise,
}) => {
  return (
    <div className={styles.options}>
      <div className={styles.optionsItem}>
        {!isTest && (
          <PrimaryButton
            text={showLabels ? "Hide Labels" : "Show Labels"}
            onClick={() => setShowLabels(!showLabels)}
          />
        )}
        <PrimaryButton
          text={showPlayed ? "Hide Played" : "Show Played"}
          onClick={() => setShowPlayed(!showPlayed)}
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
