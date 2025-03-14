"use client";
import PianoKeys from "./Keys/PianoKeys";
import { PianoOptions } from "./Options/PianoOptions";
import React, { useState } from "react";
import styles from "./Piano.module.css";
import { Key } from "@/types/piano.types";
import { CheckResponse } from "../ScaleExercise/ScaleExercise";
import PianoCheck from "./Check/PianoCheck";

interface PianoProps {
  checkExercise: (playedNotes: Key[]) => CheckResponse;
  type?: "test" | "practice";
  scale?: string;
}

const Piano: React.FC<PianoProps> = ({
  checkExercise,
  type = "practice",
  scale,
}) => {
  const isTest = type === "test";

  const [showLabels, setShowLabels] = useState<boolean>(!isTest);
  const [showPlayed, setShowPlayed] = useState<boolean>(true);
  const [playedNotes, setPlayedNotes] = useState<Key[]>([]);
  const [checkResponse, setCheckResponse] = useState<CheckResponse | null>(
    null
  );

  const handleKeyClick = (key: Key) => {
    if (checkResponse) setCheckResponse(null);

    setPlayedNotes((prevPlayedNotes) => {
      const keyExists = prevPlayedNotes.some(
        (playedKey) =>
          playedKey.label === key.label && playedKey.octave === key.octave
      );

      if (keyExists) {
        return prevPlayedNotes.filter(
          (playedKey) =>
            !(playedKey.label === key.label && playedKey.octave === key.octave)
        );
      } else {
        return [...prevPlayedNotes, key];
      }
    });
  };

  const resetNotes = () => {
    setPlayedNotes([]);
    setCheckResponse(null);
  };

  const isPlayed = (key: Key) => {
    return playedNotes.some(
      (playedKey) =>
        playedKey.label === key.label && playedKey.octave === key.octave
    );
  };

  const getPositionOfKey = (key: Key): number => {
    return (
      playedNotes.findIndex(
        (playedKey) =>
          playedKey.label === key.label && playedKey.octave === key.octave
      ) + 1
    );
  };

  const handleCheckExercise = () => {
    const response = checkExercise(playedNotes);
    setShowPlayed(true);
    setCheckResponse(response);
  };

  return (
    <div className={styles.container}>
      <p className={styles.instructions}>Play all {scale} notes in order.</p>
      <PianoOptions
        playedNotes={playedNotes}
        isTest={isTest}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        showPlayed={showPlayed}
        setShowPlayed={setShowPlayed}
        resetNotes={resetNotes}
        handleCheckExercise={handleCheckExercise}
      />
      <PianoKeys
        handleKeyClick={handleKeyClick}
        isPlayed={isPlayed}
        getPositionOfKey={getPositionOfKey}
        showLabels={showLabels}
        showPlayed={showPlayed}
        checkResponse={checkResponse}
      />
      {checkResponse && (
        <PianoCheck message={checkResponse.message} resetNotes={resetNotes} />
      )}
    </div>
  );
};

export default Piano;
