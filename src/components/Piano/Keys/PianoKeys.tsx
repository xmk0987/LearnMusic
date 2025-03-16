"use client";
import React from "react";
import styles from "./PianoKeys.module.css";
import { KEYS } from "@/lib/pianoConfig";
import PianoKey from "./PianoKey";
import { usePiano } from "@/context/PianoContext";

const PianoKeys = () => {
  const {
    handleKeyClick,
    isPlayed,
    getPositionOfKey,
    isNextKey,
    showLabels,
    showNext,
    showPlayed,
    checkResponse,
    activeNotes,
  } = usePiano();

  return (
    <div className={styles.piano}>
      {KEYS.map((key, i) => (
        <PianoKey
          key={i}
          keyData={key}
          isPlayed={isPlayed(key)}
          getPositionOfKey={getPositionOfKey}
          handleKeyClick={handleKeyClick}
          isNextkey={isNextKey}
          showLabels={showLabels}
          showNext={showNext}
          showPlayed={showPlayed}
          checkResponse={checkResponse}
          isActive={activeNotes.has(key)}
        />
      ))}
    </div>
  );
};

export default PianoKeys;
