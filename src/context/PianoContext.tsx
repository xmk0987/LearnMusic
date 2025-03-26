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
  playedNotes: Key[];
  setPlayedNotes: React.Dispatch<React.SetStateAction<Key[]>>;
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

  const [playedNotes, setPlayedNotes] = useState<Key[]>([]);
  const [activeNotes, setActiveNotes] = useState<Set<Key>>(new Set());
  const playedNotesRef = useRef<Key[]>([]);
  const keyPressTimes = useRef<{ [note: string]: number }>({});

  const {
    audioAllowed,
    initAudio,
    triggerAttack,
    triggerRelease,
    loadingSampler,
  } = useAudioContext();

  useEffect(() => {
    playedNotesRef.current = playedNotes;
  }, [playedNotes]);

  const registerKeyClick = (key: Key) => {
    switch (exerciseConfig.exercise.type) {
      case "play_single_note":
        exerciseConfig.handleKeyClick(key);
        break;
      case "play_scale":
        setPlayedNotes((prevPlayedNotes) => {
          const keyExists = prevPlayedNotes.some(
            (playedKey) =>
              playedKey.label === key.label && playedKey.octave === key.octave
          );

          const updatedPlayedNotes = keyExists
            ? prevPlayedNotes.filter(
                (playedKey) =>
                  !(
                    playedKey.label === key.label &&
                    playedKey.octave === key.octave
                  )
              )
            : [...prevPlayedNotes, key];

          return updatedPlayedNotes;
        });
        break;
    }
  };

  const getPositionOfKey = useCallback(
    (key: Key) =>
      playedNotes.findIndex(
        (playedKey) =>
          playedKey.label === key.label && playedKey.octave === key.octave
      ) + 1,
    [playedNotes]
  );

  const isPlayed = useCallback(
    (key: Key) => {
      switch (exerciseConfig.exercise.type) {
        case "play_single_note":
          if (exerciseConfig.noteFeedback)
            return Object.keys(exerciseConfig.noteFeedback).includes(
              `${key.label}/${key.octave}`
            );
          return false;
        case "play_scale":
          return playedNotes.some(
            (playedKey) =>
              playedKey.label === key.label && playedKey.octave === key.octave
          );

        default:
          return false;
      }
    },
    [exerciseConfig.exercise.type, exerciseConfig.noteFeedback, playedNotes]
  );

  const handleCheckExercise = () => {
    setUiSettings((prev) => ({
      ...prev,
      showPlayed: true,
      showCheckModal: true,
    }));

    console.log("Lets check exercise");
    switch (exerciseConfig.exercise.type) {
      case "play_single_note":
        return;
      case "play_scale":
        return;
      default:
        return;
    }
  };

  const isNextKey = (/* key: Key */): boolean => {
    switch (exerciseConfig.exercise.type) {
      case "play_single_note":
        return false;
      case "play_scale":
        return false;
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
        playedNotes,
        uiSettings,
        toggleSetting,
        setPlayedNotes,
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
