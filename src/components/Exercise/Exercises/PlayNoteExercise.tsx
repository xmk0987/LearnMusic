import React, { useEffect, useCallback, useState } from "react";
import type { PlayNotesExercise as PlayNoteExercise } from "@/types/chapters.types";
import Piano from "@/components/Piano/Piano";
import styles from "./Exercises.module.css";
import { Key } from "@/types/piano.types";

interface PlayNoteExerciseProps {
  isTest: boolean;
  exercise: PlayNoteExercise;
}

export type NoteFeedback = {
  [note: string]: "correct" | "wrong" | null;
};

const PlayNoteExercise: React.FC<PlayNoteExerciseProps> = ({
  exercise,
  isTest,
}) => {
  const [usedNotes, setUsedNotes] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const [noteFeedback, setNoteFeedback] = useState<NoteFeedback | null>(null);
  const [exerciseFinished, setExerciseFinished] = useState<boolean>(false);

  const getRandomNoteIndex = useCallback(() => {
    const availableNotes = exercise.notes.filter(
      (_, index) => !usedNotes.includes(index)
    );
    if (availableNotes.length === 0) {
      console.log("exercise finished");
      setExerciseFinished(true);
      return null;
    }
    const randomIndex = Math.floor(Math.random() * availableNotes.length);
    return exercise.notes.indexOf(availableNotes[randomIndex]);
  }, [exercise.notes, usedNotes]);

  const handleNotePlayed = (key: Key) => {
    if (loading || exerciseFinished) return;

    const noteKey = `${key.label}/${key.octave}`;

    if (
      currentNoteIndex !== null &&
      key.value.includes(exercise.notes[currentNoteIndex])
    ) {
      setLoading(true);
      setNoteFeedback((prevFeedback) => ({
        ...prevFeedback,
        [noteKey]: "correct",
      }));

      setUsedNotes((prevNotes) => [...prevNotes, currentNoteIndex]);

      setTimeout(() => {
        setNoteFeedback(null);
        setLoading(false);
      }, 1000);
    } else {
      setNoteFeedback((prevFeedback) => ({
        ...prevFeedback,
        [noteKey]: "wrong",
      }));
    }
  };

  useEffect(() => {
    if (usedNotes.length < exercise.notes.length) {
      const nextNoteIndex = getRandomNoteIndex();
      setCurrentNoteIndex(nextNoteIndex);
    } else {
      console.log("Comes here");
      setCurrentNoteIndex(null);
      setExerciseFinished(true);
    }
  }, [usedNotes]);

  const resetExercise = () => {
    console.log("reset");
    setUsedNotes([]);
    setExerciseFinished(false);
    setNoteFeedback(null);
  };

  const exerciseConfig = {
    exercise,
    isTest,
    handleKeyClick: handleNotePlayed,
    noteFeedback,
    exerciseFinished,
    resetExercise,
  };

  return (
    <div className={styles.container}>
      {currentNoteIndex !== null && !exerciseFinished ? (
        <div className={styles.task}>{exercise.notes[currentNoteIndex]}</div>
      ) : (
        <h3>Well done!</h3>
      )}

      <Piano exerciseConfig={exerciseConfig} />
    </div>
  );
};

export default PlayNoteExercise;
