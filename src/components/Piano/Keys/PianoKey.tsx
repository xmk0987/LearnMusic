"use client";
import React, { useEffect, useCallback, useMemo } from "react";
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

  // Memoize active status and key label
  const isActive = useMemo(
    () => activeNotes.has(keyData),
    [activeNotes, keyData]
  );
  const keyLabel = useMemo(
    () => `${keyData.label}${keyData.octave}`,
    [keyData]
  );

  // Memoize note feedback and status from checkResponse
  const noteFeedback = useMemo(() => {
    return checkResponse?.notes.find(
      (feedback: CheckResponseNote) =>
        feedback.note === keyData.label && feedback.octave === keyData.octave
    );
  }, [checkResponse, keyData]);
  const noteStatus = noteFeedback?.status;
  const spanStyle = noteStatus ? styles[noteStatus] : "";

  // Determine if this key is the next expected key
  const isNext = useMemo(() => isNextKey(keyData), [isNextKey, keyData]);

  // Wrap event handlers in useCallback to avoid unnecessary re-creations
  const handleMouseDown = useCallback(() => {
    handleKeyEvent(keyData, true);
  }, [handleKeyEvent, keyData]);

  const handleMouseUp = useCallback(() => {
    handleKeyEvent(keyData, false);
  }, [handleKeyEvent, keyData]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleKeyEvent(keyData, true);
    },
    [handleKeyEvent, keyData]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleKeyEvent(keyData, false);
    },
    [handleKeyEvent, keyData]
  );

  // Attach keyboard event listeners for the key (using keyData.keyboardKey)
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
  }, [keyData.keyboardKey, handleMouseDown, handleMouseUp]);

  // Memoize the content to be rendered inside the key button
  const playedContent = useMemo(() => {
    if (showPlayed && isPlayed(keyData)) {
      return (
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
      );
    } else if (showLabels) {
      return (
        <div className={styles.playedContainer}>
          <span>{keyLabel}</span>
          {showKeyboardKeys && <span>{keyData.keyboardKey}</span>}
        </div>
      );
    }
    return null;
  }, [
    isPlayed,
    keyData,
    getPositionOfKey,
    keyLabel,
    showLabels,
    showKeyboardKeys,
    showPlayed,
    spanStyle,
  ]);

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
      {playedContent}
    </button>
  );
};

export default React.memo(PianoKey);
