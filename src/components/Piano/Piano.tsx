"use client";
import React, { useState } from "react";
import styles from "./Piano.module.css";
import { KEYS, Key } from "@/lib/pianoConfig";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { CheckResponse } from "../ScaleExercise/ScaleExercise";

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
      <div className={styles.piano}>
        {KEYS.map((key, i) => {
          if (key.type === "white") {
            const keyLabel = `${key.label}${key.octave}`;
            const noteFeedback = checkResponse?.notes.find(
              (feedback) =>
                feedback.note === key.label && feedback.octave === key.octave
            );
            const noteStatus = noteFeedback?.status;
            const spanStyle = noteStatus ? styles[noteStatus] : "";

            return (
              <button
                key={i}
                className={`${styles.key} ${styles.whiteKey}`}
                onClick={() => handleKeyClick(key)}
              >
                {showPlayed && isPlayed(key) ? (
                  <div className={styles.playedContainer}>
                    <span className={`${styles.played} ${spanStyle}`}>
                      {getPositionOfKey(key)}
                    </span>
                    {showLabels && <>{keyLabel}</>}
                  </div>
                ) : (
                  <>{showLabels && <>{keyLabel}</>}</>
                )}
              </button>
            );
          } else {
            // Similar logic for black keys.
            const keyLabel = `${key.label}${key.octave}`;
            const noteFeedback = checkResponse?.notes.find(
              (feedback) =>
                feedback.note === key.label && feedback.octave === key.octave
            );
            const noteStatus = noteFeedback?.status;
            const spanStyle = noteStatus
              ? styles[noteStatus]
              : isPlayed(key)
              ? styles.played
              : "";

            return (
              <button
                key={i}
                className={`${styles.key} ${styles.blackKey}`}
                onClick={() => handleKeyClick(key)}
              >
                {showPlayed && isPlayed(key) ? (
                  <div className={styles.playedContainer}>
                    <span className={`${styles.played} ${spanStyle}`}>
                      {getPositionOfKey(key)}
                    </span>
                    {showLabels && <>{keyLabel}</>}
                  </div>
                ) : (
                  <>{showLabels && <>{keyLabel}</>}</>
                )}
              </button>
            );
          }
        })}
      </div>
      {checkResponse && (
        <div className={styles.extraInfo}>
          <p className={styles.message}>{checkResponse?.message}</p>
          <PrimaryButton text={"Try again"} onClick={resetNotes} color="red" />
          <div className={styles.colorLabels}>
            <div>
              <span className={styles.greenLabel}></span> Correct
            </div>
            <div>
              <span className={styles.orangeLabel}></span> Wrong Position
            </div>
            <div>
              <span className={styles.redLabel}></span> Wrong Note
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Piano;
