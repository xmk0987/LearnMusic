"use client";
import React from "react";
import styles from "./PianoKeys.module.css";
import { KEYS } from "@/lib/pianoConfig";
import { Key } from "@/types/piano.types";
import PianoKey from "./PianoKey";
import { CheckResponse } from "@/components/ScaleExercise/ScaleExercise";

interface PianoKeysProps {
  handleKeyClick: (key: Key) => void;
  isPlayed: (key: Key) => boolean;
  getPositionOfKey: (key: Key) => number;
  showLabels: boolean;
  showPlayed: boolean;
  checkResponse?: CheckResponse | null;
}

const PianoKeys: React.FC<PianoKeysProps> = ({
  handleKeyClick,
  isPlayed,
  getPositionOfKey,
  showLabels,
  showPlayed,
  checkResponse,
}) => {
  return (
    <div className={styles.piano}>
      {KEYS.map((key, i) => (
        <PianoKey
          key={i}
          keyData={key}
          isPlayed={isPlayed(key)}
          getPositionOfKey={getPositionOfKey}
          handleKeyClick={handleKeyClick}
          showLabels={showLabels}
          showPlayed={showPlayed}
          checkResponse={checkResponse}
        />
      ))}
    </div>
  );
};

export default PianoKeys;
