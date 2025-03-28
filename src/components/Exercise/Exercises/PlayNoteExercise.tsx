import React, { useEffect, useCallback, useState } from "react";
import type { PlayNotesExercise as PlayNoteExercise } from "@/types/chapters.types";
import Piano from "@/components/Piano/Piano";
import styles from "./Exercises.module.css";
import { ExerciseFeedback, Key } from "@/types/piano.types";

interface PlayNoteExerciseProps {
  isTest: boolean;
  exercise: PlayNoteExercise;
}
const PlayNoteExercise: React.FC<PlayNoteExerciseProps> = ({
  exercise,
  isTest,
}) => {
  const [usedNotes, setUsedNotes] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const [exerciseFeedback, setExerciseFeedback] = useState<ExerciseFeedback>({
    message: "",
    notes: {},
    allCorrect: false,
  });
  const [exerciseFinished, setExerciseFinished] = useState<boolean>(false);

  const getRandomNoteIndex = useCallback(() => {
    const availableNotes = exercise.notes.filter(
      (_, index) => !usedNotes.includes(index)
    );
    if (availableNotes.length === 0) {
      setExerciseFinished(true);
      return null;
    }
    const randomIndex = Math.floor(Math.random() * availableNotes.length);
    return exercise.notes.indexOf(availableNotes[randomIndex]);
  }, [exercise.notes, usedNotes]);

  const handleNotePlayed = (key: Key) => {
    if (loading || exerciseFinished) return;

    const possiblePlayedNotes = key.value.map((note) => `${note}`);

    const matchingNote = possiblePlayedNotes.find(
      (note) =>
        currentNoteIndex !== null && note === exercise.notes[currentNoteIndex]
    );

    const isCorrect = matchingNote !== undefined;
    const feedbackKey = (matchingNote || possiblePlayedNotes[0]) + key.octave;
    setExerciseFeedback((prevFeedback) => ({
      ...prevFeedback,
      notes: {
        ...prevFeedback.notes,
        [feedbackKey]: isCorrect ? "correct" : "wrong",
      },
    }));

    if (isCorrect) {
      setLoading(true);
      if (currentNoteIndex !== null) {
        setUsedNotes((prevNotes) => [...prevNotes, currentNoteIndex]);
      }

      setTimeout(() => {
        setExerciseFeedback({
          message: "",
          notes: {},
          allCorrect: false,
        });
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (usedNotes.length < exercise.notes.length) {
      const nextNoteIndex = getRandomNoteIndex();
      setCurrentNoteIndex(nextNoteIndex);
    } else {
      setCurrentNoteIndex(null);
      setExerciseFinished(true);
    }
  }, [exercise.notes.length, getRandomNoteIndex, usedNotes]);

  const resetExercise = () => {
    setUsedNotes([]);
    setExerciseFinished(false);
    setExerciseFeedback({
      message: "",
      notes: {},
      allCorrect: false,
    });
  };

  const exerciseConfig = {
    exercise,
    isTest,
    handleKeyClick: handleNotePlayed,
    exerciseFeedback,
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
