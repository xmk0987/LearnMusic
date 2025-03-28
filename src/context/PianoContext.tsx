// PianoContext.tsx
"use client";
import {
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  useCallback,
} from "react";
import { ExerciseConfig, Key } from "@/types/piano.types";
import { useMidi } from "@/hooks/useMidiInput";
import { getSessionStorage, setSessionStorage } from "@/utils/helpers";
import { useAudioContext } from "./AudioContext";
import EnableAudioModal from "@/components/Modals/EnableAudio/EnableAudioModal";
import type { ExerciseTypes } from "@/types/chapters.types";

interface PianoUiSettings {
  showLabels: boolean;
  showPlayed: boolean;
  showNext: boolean;
  showKeyboardKeys: boolean;
  showCheckModal: boolean;
}
interface PianoContextProps {
  // States
  uiSettings: PianoUiSettings;
  activeNotes: Set<Key>;
  setActiveNotes: React.Dispatch<React.SetStateAction<Set<Key>>>;
  // Functions
  isPlayed: (key: Key) => boolean;
  getPositionOfKey: (key: Key) => number;
  handleCheckExercise: () => void;
  isNextKey: (key: Key) => boolean;
  toggleSetting: (key: keyof PianoUiSettings) => void;
  getNote: (key: Key) => string;
  handleKeyEvent: (key: Key, isPressing: boolean, isMidi?: boolean) => void;
  // Other values
  isTest: boolean;
  exerciseType: ExerciseTypes;
  exerciseConfig: ExerciseConfig;
}

interface PianoProviderProps {
  children: React.ReactNode;
  exerciseConfig: ExerciseConfig;
}
const PianoContext = createContext<PianoContextProps | undefined>(undefined);

export const PianoProvider: React.FC<PianoProviderProps> = ({
  exerciseConfig,
  children,
}) => {
  const isTest = exerciseConfig.isTest;
  const [uiSettings, setUiSettings] = useState<PianoUiSettings>(() => {
    return getSessionStorage("pianoUiSettings", {
      showLabels: !isTest,
      showPlayed: true,
      showNext: false,
      showKeyboardKeys: false,
      showCheckModal: false,
    });
  });

  useEffect(() => {
    setSessionStorage("pianoUiSettings", uiSettings);
  }, [uiSettings]);

  // Generic toggle function
  const toggleSetting = (key: keyof typeof uiSettings) => {
    setUiSettings((prev: PianoUiSettings) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const [activeNotes, setActiveNotes] = useState<Set<Key>>(new Set());
  const keyPressTimes = useRef<{ [note: string]: number }>({});

  const {
    audioAllowed,
    initAudio,
    triggerAttack,
    triggerRelease,
    loadingSampler,
  } = useAudioContext();

  const registerKeyClick = (key: Key) => {
    switch (exerciseConfig.exercise.type) {
      case "play_single_note":
        if (exerciseConfig.handleKeyClick) exerciseConfig.handleKeyClick(key);
        break;
      case "play_scale":
        if (exerciseConfig.handleKeyClick) exerciseConfig.handleKeyClick(key);
        break;
    }
  };

  const getPositionOfKey = useCallback(
    (key: Key) => {
      if (exerciseConfig.playedNotes) {
        return (
          exerciseConfig.playedNotes.findIndex(
            (playedKey) =>
              playedKey.label === key.label && playedKey.octave === key.octave
          ) + 1
        );
      }
      return -1;
    },
    [exerciseConfig.playedNotes]
  );

  const isPlayed = useCallback(
    (key: Key) => {
      switch (exerciseConfig.exercise.type) {
        case "play_single_note":
          if (exerciseConfig.exerciseFeedback)
            return Object.keys(exerciseConfig.exerciseFeedback).includes(
              `${key.label}/${key.octave}`
            );
          return false;
        case "play_scale":
          return (
            exerciseConfig.playedNotes?.some(
              (playedKey) =>
                playedKey.label === key.label && playedKey.octave === key.octave
            ) ?? false
          );
        default:
          return false;
      }
    },
    [
      exerciseConfig.exercise.type,
      exerciseConfig.exerciseFeedback,
      exerciseConfig.playedNotes,
    ]
  );

  const handleCheckExercise = () => {
    console.log("Check exercise");
    setUiSettings((prev) => ({
      ...prev,
      showPlayed: true,
      showCheckModal: true,
    }));

    if (typeof exerciseConfig.checkExercise === "function") {
      exerciseConfig.checkExercise();
    }
  };

  const isNextKey = (key: Key): boolean => {
    switch (exerciseConfig.exercise.type) {
      case "play_single_note":
        return false;
      case "play_scale":
        const expectedNotes = exerciseConfig.expectedNotes ?? [];

        const playedNotes = exerciseConfig.playedNotes ?? [];

        for (let i = 0; i < playedNotes.length; i++) {
          const isIncorrect = playedNotes[i].value.every(
            (note) => `${note}${playedNotes[i].octave}` !== expectedNotes[i]
          );

          if (isIncorrect) {
            return false;
          }
        }

        const nextNoteIndex = playedNotes.length;

        if (nextNoteIndex >= expectedNotes.length) return false;

        const nextExpectedNote = expectedNotes[nextNoteIndex];

        return key.value.some(
          (note) => `${note}${key.octave}` === nextExpectedNote
        );
      default:
        return false;
    }
  };

  const getNote = (key: Key) => {
    return `${key.label.includes("/") ? key.label.split("/")[0] : key.label}${
      key.octave
    }`;
  };

  const handleKeyEvent = async (
    key: Key,
    isPressing: boolean,
    isMidi: boolean = false
  ) => {
    const note = getNote(key);

    if (isPressing) {
      if (!audioAllowed && isMidi) await initAudio();
      keyPressTimes.current[note] = performance.now();
      await triggerAttack(note);

      setActiveNotes((prev) => new Set(prev).add(key));
      registerKeyClick(key);
    } else {
      const now = performance.now();
      const pressTime = keyPressTimes.current[note] || now;
      const elapsed = (now - pressTime) / 1000;
      const Tone = await import("tone");
      const minDuration = Tone.Time("4n").toSeconds();

      if (elapsed < minDuration) {
        setTimeout(() => triggerRelease(note), (minDuration - elapsed) * 1000);
      } else {
        await triggerRelease(note);
      }

      setActiveNotes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  useMidi(
    (midiKey: Key) => {
      handleKeyEvent(midiKey, true, true);
    },
    (midiKey: Key) => {
      handleKeyEvent(midiKey, false, true);
    },
    () => exerciseConfig.resetExercise(),
    () => handleCheckExercise()
  );

  return (
    <PianoContext.Provider
      value={{
        uiSettings,
        toggleSetting,
        activeNotes,
        setActiveNotes,
        handleKeyEvent,
        isPlayed,
        getPositionOfKey,
        handleCheckExercise,
        isNextKey,
        getNote,
        isTest,
        exerciseType: exerciseConfig.exercise.type,
        exerciseConfig,
      }}
    >
      {children}
      {!audioAllowed && !loadingSampler && (
        <EnableAudioModal initAudio={initAudio} />
      )}
    </PianoContext.Provider>
  );
};

export const usePiano = () => {
  const context = useContext(PianoContext);
  if (context === undefined) {
    throw new Error("usePiano must be used within a PianoProvider");
  }
  return context;
};
