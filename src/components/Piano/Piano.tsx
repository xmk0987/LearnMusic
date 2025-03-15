"use client";
import PianoKeys from "./Keys/PianoKeys";
import { PianoOptions } from "./Options/PianoOptions";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Piano.module.css";
import { Key } from "@/types/piano.types";
import { CheckResponse } from "../ScaleExercise/ScaleExercise";
import PianoCheck from "./Check/PianoCheck";
import { useMidi } from "@/hooks/useMidiInput";

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
  const [activeNotes, setActiveNotes] = useState<Set<Key>>(new Set());
  const checkResponseRef = useRef<CheckResponse | null>(null);
  const playedNotesRef = useRef<Key[]>([]);

  useEffect(() => {
    checkResponseRef.current = checkResponse;
  }, [checkResponse]);

  useEffect(() => {
    playedNotesRef.current = playedNotes;
  }, [playedNotes]);

  const handleKeyClick = (key: Key) => {
    if (checkResponseRef.current !== null) setCheckResponse(null);

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
    if (checkResponse !== null) {
      setCheckResponse(null);
      setTimeout(() => {
        const currentPlayedNotes = playedNotesRef.current;
        const response = checkExercise(currentPlayedNotes);
        setShowPlayed(true);
        setCheckResponse(response);
      }, 0);
    } else {
      const currentPlayedNotes = playedNotesRef.current;
      const response = checkExercise(currentPlayedNotes);
      setShowPlayed(true);
      setCheckResponse(response);
    }
  };

  const handleMidiKeyPress = (midiKey: Key) => {
    handleKeyClick(midiKey);
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.add(midiKey);
      return newSet;
    });
  };

  const handleStopMidiKeyPress = (midiKey: Key) => {
    console.log("should remove key");
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(midiKey);
      return newSet;
    });
  };

  useMidi(
    (midiKey: Key) => {
      handleMidiKeyPress(midiKey);
    },
    (midiKey: Key) => {
      handleStopMidiKeyPress(midiKey);
    },
    () => resetNotes(),
    () => handleCheckExercise()
  );

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
        activeNotes={activeNotes}
      />
      {checkResponse && (
        <PianoCheck message={checkResponse.message} resetNotes={resetNotes} />
      )}
    </div>
  );
};

export default Piano;
