"use client";
import React from "react";
import { Key } from "@/types/piano.types";
import styles from "./PianoKeys.module.css";
import { usePiano } from "@/context/PianoContext";

interface PianoKeyProps {
  keyData: Key;
}

const PianoKey: React.FC<PianoKeyProps> = ({ keyData }) => {
  const {
    isPlayed,
    getPositionOfKey,
    isNextKey,
    showLabels,
    showNext,
    showPlayed,
    checkResponse,
    activeNotes,
    handleKeyDown,
    handleKeyUp,
  } = usePiano();

  const isActive = activeNotes.has(keyData);
  const keyLabel = `${keyData.label}${keyData.octave}`;
  const noteFeedback = checkResponse?.notes.find(
    (feedback) =>
      feedback.note === keyData.label && feedback.octave === keyData.octave
  );
  const noteStatus = noteFeedback?.status;
  const spanStyle = noteStatus ? styles[noteStatus] : "";
  const isNext = isNextKey(keyData);

  // Touch events for mobile devices.
  const handleTouchStart = async (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleKeyDown(keyData);
  };

  const handleTouchEnd = async (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleKeyUp(keyData);
  };

  const handleMouseDown = () => {
    handleKeyDown(keyData);
  };

  const handleMouseUp = () => {
    handleKeyUp(keyData);
  };

  return (
    <button
      className={`${styles.key} ${
        keyData.type === "white" ? styles.whiteKey : styles.blackKey
      } ${isActive ? styles.activeNote : ""} ${
        isNext && showNext ? styles.nextKey : ""
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {showPlayed && isPlayed(keyData) ? (
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
