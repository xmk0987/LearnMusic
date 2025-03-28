import React, { useEffect, useState, useRef, useMemo } from "react";
import type { ScaleExercise } from "@/types/chapters.types";
import styles from "./Exercises.module.css";
import scalesData from "@/lessons/scales.json";
import type {
  Key,
  NoteValue,
  NoteFeedback,
  ExerciseFeedback,
} from "@/types/piano.types";
import Piano from "@/components/Piano/Piano";
import { calculateExpectedNotesWithOctaves } from "@/utils/helpers";
import NoteSheet from "@/components/NoteSheet/NoteSheet";

interface PlayScaleExerciseProps {
  isTest: boolean;
  exercise: ScaleExercise;
}

const PlayScaleExercise: React.FC<PlayScaleExerciseProps> = ({
  exercise,
  isTest,
}) => {
  const [scale, setScale] = useState<NoteValue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [exerciseFinished, setExerciseFinished] = useState<boolean>(false);
  const [playedNotes, setPlayedNotes] = useState<Key[]>([]);
  const [exerciseFeedback, setExerciseFeedback] = useState<ExerciseFeedback>({
    message: "",
    notes: {},
    allCorrect: false,
  });
  const expectedNotes = useMemo(
    () => calculateExpectedNotesWithOctaves(scale ?? [], 4),
    [scale]
  );
  const playedNotesRef = useRef<Key[]>([]);

  useEffect(() => {
    if (exercise) {
      setLoading(true);
      const foundScale = scalesData.scales.find(
        (s) => s.id === exercise.scaleId
      );
      if (foundScale) {
        setScale(foundScale.notes as NoteValue[]);
      }
    }

    setLoading(false);
  }, [exercise]);

  useEffect(() => {
    playedNotesRef.current = playedNotes;
  }, [playedNotes]);

  const handleKeyClick = (key: Key) => {
    if (exerciseFinished) return;

    setPlayedNotes((prevPlayedNotes) => {
      const keyExists = prevPlayedNotes.some(
        (playedKey) =>
          playedKey.label === key.label && playedKey.octave === key.octave
      );

      const updatedPlayedNotes = keyExists
        ? prevPlayedNotes.filter(
            (playedKey) =>
              !(
                playedKey.label === key.label && playedKey.octave === key.octave
              )
          )
        : [...prevPlayedNotes, key];

      return updatedPlayedNotes;
    });
  };

  const checkExercise = () => {
    setExerciseFinished(true);

    if (playedNotes.length === 0) {
      setExerciseFeedback({
        message: "You need to play something",
        notes: {},
        allCorrect: false,
      });
      return;
    }

    const feedback: NoteFeedback = {};

    for (let i = 0; i < playedNotes.length; i++) {
      const possiblePlayedNotes = playedNotes[i].value.map(
        (note) => `${note}${playedNotes[i].octave}`
      );

      const expectedNote = expectedNotes[i];

      if (!expectedNote) {
        feedback[possiblePlayedNotes[0]] = "wrong";
      } else if (possiblePlayedNotes.includes(expectedNote)) {
        feedback[expectedNote] = "correct";
      } else if (
        expectedNotes.some((note) => possiblePlayedNotes.includes(note))
      ) {
        feedback[possiblePlayedNotes[0]] = "wrongPosition";
      } else {
        feedback[possiblePlayedNotes[0]] = "wrong";
      }
    }

    const allCorrect =
      Object.values(feedback).every((status) => status === "correct") &&
      playedNotes.length === expectedNotes.length;

    let message = "";
    if (playedNotes.length > expectedNotes.length) {
      message = "Too many notes played";
    } else if (playedNotes.length < expectedNotes.length) {
      message = "Too few notes played";
    } else if (allCorrect) {
      message = "Well done!";
    } else {
      message = "Some notes are incorrect";
    }

    setExerciseFeedback({ message, notes: feedback, allCorrect });
  };

  const resetExercise = () => {
    setPlayedNotes([]);
    setExerciseFinished(false);
    setExerciseFeedback({ message: "", notes: {}, allCorrect: false });
  };

  if (loading)
    return (
      <div className={styles.container}>
        <p>Loading exercise</p>
      </div>
    );

  const exerciseConfig = {
    exercise,
    isTest,
    exerciseFinished,
    playedNotes,
    expectedNotes,
    exerciseFeedback,
    resetExercise,
    handleKeyClick,
    checkExercise,
  };

  return (
    <div className={styles.container}>
      <NoteSheet notes={expectedNotes} noteFeedback={exerciseFeedback?.notes} />
      <Piano exerciseConfig={exerciseConfig} />
    </div>
  );
};

export default PlayScaleExercise;
