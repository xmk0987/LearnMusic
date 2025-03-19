"use client";
import React, { useEffect, useCallback } from "react";
import { Key } from "@/types/piano.types";
import styles from "./PianoKeys.module.css";
import { usePiano } from "@/context/PianoContext";
import type { CheckResponseNote } from "@/context/ExerciseContext";

interface PianoKeyProps {
  keyData: Key;
}

const PianoKey: React.FC<PianoKeyProps> = ({ keyData }) => {
  const {
    isPlayed,
    getPositionOfKey,
    isNextKey,
    showLabels,
    showKeyboardKeys,
    showNext,
    showPlayed,
    checkResponse,
    activeNotes,
    handleKeyEvent,
  } = usePiano();

  const isActive = activeNotes.has(keyData);
  const keyLabel = `${keyData.label}${keyData.octave}`;
  const noteFeedback = checkResponse?.notes.find(
    (feedback: CheckResponseNote) =>
      feedback.note === keyData.label && feedback.octave === keyData.octave
  );
  const noteStatus = noteFeedback?.status;
  const spanStyle = noteStatus ? styles[noteStatus] : "";
  const isNext = isNextKey(keyData);

  // Touch events for mobile devices.
  const handleTouchStart = async (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleKeyEvent(keyData, true);
  };

  const handleTouchEnd = async (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleKeyEvent(keyData, false);
  };

  const handleMouseDown = useCallback(() => {
    handleKeyEvent(keyData, true);
  }, [handleKeyEvent, keyData]);

  const handleMouseUp = useCallback(() => {
    handleKeyEvent(keyData, false);
  }, [handleKeyEvent, keyData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === keyData.keyboardKey && !e.repeat) {
        handleMouseDown();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === keyData.keyboardKey && !e.repeat) {
        handleMouseUp();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyData, handleMouseDown, handleMouseUp]);

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
          {showLabels && (
            <>
              <span>{keyLabel}</span>
              {showKeyboardKeys && <span>{keyData.keyboardKey}</span>}
            </>
          )}
        </div>
      ) : (
        <>
          {showLabels && (
            <div className={styles.playedContainer}>
              <span>{keyLabel}</span>
              {showKeyboardKeys && <span>{keyData.keyboardKey}</span>}
            </div>
          )}
        </>
      )}
    </button>
  );
};

export default PianoKey;
