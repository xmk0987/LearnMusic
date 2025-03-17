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
import { CheckResponse } from "@/components/ScaleExercise/ScaleExercise";
import { Key } from "@/types/piano.types";
import { Exercise } from "@/types/lessons.types";
import { useMidi } from "@/hooks/useMidiInput";
import { calculateExpectedNotesWithOctaves } from "@/utils/helpers";
import { useAudioContext } from "./AudioContext";
import EnableAudioModal from "@/components/EnableAudioModal/EnableAudioModal";

interface PianoContextProps {
  // States
  showLabels: boolean;
  showPlayed: boolean;
  showKeyboardKeys: boolean;
  showNext: boolean;
  playedNotes: Key[];
  setPlayedNotes: React.Dispatch<React.SetStateAction<Key[]>>;
  checkResponse: CheckResponse | null;
  setCheckResponse: React.Dispatch<React.SetStateAction<CheckResponse | null>>;
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
  // Props passed to provider
  scale?: Exercise;
  checkExercise: (playedNotes: Key[]) => CheckResponse;
  type: "test" | "practice";
  isTest: boolean;
}

interface PianoProviderProps {
  children: React.ReactNode;
  checkExercise: (playedNotes: Key[]) => CheckResponse;
  type?: "test" | "practice";
  scale?: Exercise;
}

const PianoContext = createContext<PianoContextProps | undefined>(undefined);

export const PianoProvider: React.FC<PianoProviderProps> = ({
  children,
  checkExercise,
  type = "practice",
  scale,
}) => {
  const isTest = type === "test";
  const [showLabels, setShowLabels] = useState<boolean>(!isTest);
  const [showPlayed, setShowPlayed] = useState<boolean>(true);
  const [showNext, setShowNext] = useState<boolean>(!isTest);
  const [showKeyboardKeys, setShowKeyboardKeys] = useState<boolean>(false);

  const [playedNotes, setPlayedNotes] = useState<Key[]>([]);
  const [checkResponse, setCheckResponse] = useState<CheckResponse | null>(
    null
  );
  const [activeNotes, setActiveNotes] = useState<Set<Key>>(new Set());
  const checkResponseRef = useRef<CheckResponse | null>(null);
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
    checkResponseRef.current = checkResponse;
  }, [checkResponse]);

  useEffect(() => {
    playedNotesRef.current = playedNotes;
  }, [playedNotes]);

  const registerKeyClick = (key: Key) => {
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

      setCheckResponse(null);
      return updatedPlayedNotes;
    });
  };

  const resetNotes = () => {
    setPlayedNotes([]);
    setCheckResponse(null);
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

  const isNextKey = (key: Key): boolean => {
    if (!scale) return false;

    const startingOctave =
      playedNotes.length > 0 ? playedNotes[0].octave : key.octave;
    const expectedNotes = calculateExpectedNotesWithOctaves(
      scale.notes,
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
        setCheckResponse,
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
        scale,
        checkExercise,
        getNote,
        type,
        isTest,
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
