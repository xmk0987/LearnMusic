"use client";
import React, { useEffect, useCallback, useMemo } from "react";
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
    uiSettings,
    activeNotes,
    handleKeyEvent,
    exerciseConfig,
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

  const possibleNoteKeys = keyData.value.map(
    (note) => `${note}${keyData.octave}`
  );

  const noteStatus =
    possibleNoteKeys
      .map((noteKey) => exerciseConfig.exerciseFeedback?.notes[noteKey])
      .find((status) => status !== undefined) ?? null;

  const spanStyle = noteStatus ? styles[noteStatus] : "";

  // Memoize the content to be rendered inside the key button
  const playedContent = useMemo(() => {
    if (
      uiSettings.showPlayed &&
      isPlayed(keyData) &&
      exerciseConfig.exercise.type === "play_scale"
    ) {
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
    exerciseConfig.exercise.type,
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
      } ${
        exerciseConfig.exercise.type === "play_single_note" ? spanStyle : ""
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
