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
import type { CheckResponse } from "./ExerciseContext";
import { Key } from "@/types/piano.types";
import { Exercise } from "@/types/lessons.types";
import { useMidi } from "@/hooks/useMidiInput";
import { calculateExpectedNotesWithOctaves } from "@/utils/helpers";
import { useAudioContext } from "./AudioContext";
import EnableAudioModal from "@/components/Modals/EnableAudio/EnableAudioModal";
import { useExercise } from "./ExerciseContext";

interface PianoContextProps {
  // States
  showLabels: boolean;
  showPlayed: boolean;
  showKeyboardKeys: boolean;
  showNext: boolean;
  playedNotes: Key[];
  isTest: boolean;
  setPlayedNotes: React.Dispatch<React.SetStateAction<Key[]>>;
  activeNotes: Set<Key>;
  setActiveNotes: React.Dispatch<React.SetStateAction<Set<Key>>>;
  // Functions
  resetNotes: () => void;
  isPlayed: (key: Key) => boolean;
  getPositionOfKey: (key: Key) => number;
  handleCheckExercise: () => void;
  toggleShowLabels: () => void;
  toggleShowNext: () => void;
  toggleShowPlayed: () => void;
  toggleShowKeyboardKeys: () => void;
  isNextKey: (key: Key) => boolean;
  getNote: (key: Key) => string;
  handleKeyEvent: (key: Key, isPressing: boolean, isMidi?: boolean) => void;
  // Exercise Provider
  currentExercise: Exercise;
  type: "test" | "practice";
  checkResponse: CheckResponse | null;
  closeCheckResponse: () => void;
  checkExerciseByCategoryAndType: (playedKeys: Key[]) => void;
  goToNextExercise: () => void;
  isLastExercise: boolean;
}

interface PianoProviderProps {
  children: React.ReactNode;
}
const PianoContext = createContext<PianoContextProps | undefined>(undefined);

export const PianoProvider: React.FC<PianoProviderProps> = ({ children }) => {
  const {
    type,
    closeCheckResponse,
    checkResponse,
    checkExerciseByCategoryAndType,
    currentExercise,
    goToNextExercise,
    isLastExercise,
  } = useExercise();
  const isTest = type === "test";
  const [showLabels, setShowLabels] = useState<boolean>(!isTest);
  const [showPlayed, setShowPlayed] = useState<boolean>(true);
  const [showNext, setShowNext] = useState<boolean>(!isTest);
  const [showKeyboardKeys, setShowKeyboardKeys] = useState<boolean>(false);

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
    closeCheckResponse();

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

  const resetNotes = () => {
    setPlayedNotes([]);
    closeCheckResponse();
  };

  const isPlayed = useCallback(
    (key: Key) =>
      playedNotes.some(
        (playedKey) =>
          playedKey.label === key.label && playedKey.octave === key.octave
      ),
    [playedNotes]
  );

  const getPositionOfKey = useCallback(
    (key: Key) =>
      playedNotes.findIndex(
        (playedKey) =>
          playedKey.label === key.label && playedKey.octave === key.octave
      ) + 1,
    [playedNotes]
  );

  const handleCheckExercise = () => {
    if (checkResponse !== null) {
      closeCheckResponse();
    }

    const currentPlayedNotes = playedNotesRef.current;
    checkExerciseByCategoryAndType(currentPlayedNotes);
    setShowPlayed(true);
  };

  const isNextKey = (key: Key): boolean => {
    if (!currentExercise) return false;

    const startingOctave =
      playedNotes.length > 0 ? playedNotes[0].octave : key.octave;
    const expectedNotes = calculateExpectedNotesWithOctaves(
      currentExercise.notes,
      startingOctave
    );

    const playedSlice = playedNotes.map(
      (playedKey) => `${playedKey.label}${playedKey.octave}`
    );
    const expectedSlice = expectedNotes.slice(0, playedSlice.length);

    if (JSON.stringify(playedSlice) !== JSON.stringify(expectedSlice)) {
      return false;
    }

    return `${key.label}${key.octave}` === expectedNotes[playedNotes.length];
  };

  const toggleShowLabels = () => {
    setShowLabels(!showLabels);
  };

  const toggleShowNext = () => {
    setShowNext(!showNext);
  };

  const toggleShowPlayed = () => {
    setShowPlayed(!showPlayed);
  };

  const toggleShowKeyboardKeys = () => {
    setShowKeyboardKeys(!showKeyboardKeys);
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
    () => resetNotes(),
    () => handleCheckExercise()
  );

  return (
    <PianoContext.Provider
      value={{
        showLabels,
        showPlayed,
        showNext,
        playedNotes,
        setPlayedNotes,
        checkResponse,
        activeNotes,
        showKeyboardKeys,
        toggleShowKeyboardKeys,
        setActiveNotes,
        handleKeyEvent,
        resetNotes,
        isPlayed,
        getPositionOfKey,
        handleCheckExercise,
        toggleShowLabels,
        toggleShowNext,
        toggleShowPlayed,
        isNextKey,
        getNote,
        goToNextExercise,
        isLastExercise,
        isTest,
        currentExercise,
        type,
        closeCheckResponse,
        checkExerciseByCategoryAndType,
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
