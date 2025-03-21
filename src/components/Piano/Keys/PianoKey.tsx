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
    uiSettings,
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
    if (uiSettings.showPlayed && isPlayed(keyData)) {
      return (
        <div className={styles.playedContainer}>
          <span className={`${styles.played} ${spanStyle}`}>
            {getPositionOfKey(keyData)}
          </span>
          {uiSettings.showLabels && <span>{keyLabel}</span>}
          {uiSettings.showKeyboardKeys && <span>{keyData.keyboardKey}</span>}
        </div>
      );
    }

    if (uiSettings.showLabels || uiSettings.showKeyboardKeys) {
      return (
        <div className={styles.playedContainer}>
          {uiSettings.showLabels && <span>{keyLabel}</span>}
          {uiSettings.showKeyboardKeys && <span>{keyData.keyboardKey}</span>}
        </div>
      );
    }

    return null;
  }, [
    uiSettings.showPlayed,
    uiSettings.showLabels,
    uiSettings.showKeyboardKeys,
    isPlayed,
    keyData,
    spanStyle,
    getPositionOfKey,
    keyLabel,
  ]);

  return (
    <button
      className={`${styles.key} ${
        keyData.type === "white" ? styles.whiteKey : styles.blackKey
      } ${isActive ? styles.activeNote : ""} ${
        isNext && uiSettings.showNext ? styles.nextKey : ""
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
