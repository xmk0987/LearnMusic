"use client";
import React from "react";
import { Key } from "@/types/piano.types";
import { CheckResponse } from "@/components/ScaleExercise/ScaleExercise";
import styles from "./PianoKeys.module.css";

interface PianoKeyProps {
  keyData: Key;
  isPlayed: boolean;
  getPositionOfKey: (key: Key) => number;
  handleKeyClick: (key: Key) => void;
  showLabels: boolean;
  showPlayed: boolean;
  checkResponse?: CheckResponse | null;
}

const PianoKey: React.FC<PianoKeyProps> = ({
  keyData,
  isPlayed,
  getPositionOfKey,
  handleKeyClick,
  showLabels,
  showPlayed,
  checkResponse,
}) => {
  const keyLabel = `${keyData.label}${keyData.octave}`;
  const noteFeedback = checkResponse?.notes.find(
    (feedback) =>
      feedback.note === keyData.label && feedback.octave === keyData.octave
  );
  const noteStatus = noteFeedback?.status;
  const spanStyle = noteStatus ? styles[noteStatus] : "";

  return (
    <button
      className={`${styles.key} ${
        keyData.type === "white" ? styles.whiteKey : styles.blackKey
      }`}
      onClick={() => handleKeyClick(keyData)}
    >
      {showPlayed && isPlayed ? (
        <div className={styles.playedContainer}>
          <span className={`${styles.played} ${spanStyle}`}>
            {getPositionOfKey(keyData)}
          </span>
          {showLabels && <span>{keyLabel}</span>}
        </div>
      ) : (
        <>{showLabels && <span>{keyLabel}</span>}</>
      )}
    </button>
  );
};

export default PianoKey;
