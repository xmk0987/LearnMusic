// PianoContext.tsx
"use client";
import { useEffect, useState, createContext, useContext, useRef } from "react";
import { CheckResponse } from "@/components/ScaleExercise/ScaleExercise";
import { Key } from "@/types/piano.types";
import { Scale } from "@/types/lessons.types";
import { useMidi } from "@/hooks/useMidiInput";
import { calculateExpectedNotesWithOctaves } from "@/utils/helpers";
import { useAudioContext } from "./AudioContext";
import EnableAudioModal from "@/components/EnableAudioModal/EnableAudioModal";

interface PianoContextProps {
  // States
  showLabels: boolean;
  setShowLabels: React.Dispatch<React.SetStateAction<boolean>>;
  showPlayed: boolean;
  setShowPlayed: React.Dispatch<React.SetStateAction<boolean>>;
  showNext: boolean;
  setShowNext: React.Dispatch<React.SetStateAction<boolean>>;
  playedNotes: Key[];
  setPlayedNotes: React.Dispatch<React.SetStateAction<Key[]>>;
  checkResponse: CheckResponse | null;
  setCheckResponse: React.Dispatch<React.SetStateAction<CheckResponse | null>>;
  activeNotes: Set<Key>;
  setActiveNotes: React.Dispatch<React.SetStateAction<Set<Key>>>;
  // Functions
  handleKeyClick: (key: Key) => void;
  resetNotes: () => void;
  isPlayed: (key: Key) => boolean;
  getPositionOfKey: (key: Key) => number;
  handleCheckExercise: () => void;
  toggleShowLabels: () => void;
  toggleShowNext: () => void;
  toggleShowPlayed: () => void;
  isNextKey: (key: Key) => boolean;
  // Props passed to provider
  scale?: Scale;
  checkExercise: (playedNotes: Key[]) => CheckResponse;
  type: "test" | "practice";
  isTest: boolean;
}

interface PianoProviderProps {
  children: React.ReactNode;
  checkExercise: (playedNotes: Key[]) => CheckResponse;
  type?: "test" | "practice";
  scale?: Scale;
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

  const [playedNotes, setPlayedNotes] = useState<Key[]>([]);
  const [checkResponse, setCheckResponse] = useState<CheckResponse | null>(
    null
  );
  const [activeNotes, setActiveNotes] = useState<Set<Key>>(new Set());
  const checkResponseRef = useRef<CheckResponse | null>(null);
  const playedNotesRef = useRef<Key[]>([]);

  const { playNote, audioAllowed, initAudio } = useAudioContext();

  useEffect(() => {
    checkResponseRef.current = checkResponse;
  }, [checkResponse]);

  useEffect(() => {
    playedNotesRef.current = playedNotes;
  }, [playedNotes]);

  const handleKeyClick = async (key: Key) => {
    const label = key.label.includes("/") ? key.label.split("/")[0] : key.label;
    const note = `${label}${key.octave}`;
    await playNote(note);

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
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(midiKey);
      return newSet;
    });
  };

  const isNextKey = (key: Key): boolean => {
    if (!scale) return false;

    if (playedNotes.length === 0) {
      return key.label === scale.notes[0];
    }

    const startingOctave = playedNotes[0].octave;
    const expectedNotes = calculateExpectedNotesWithOctaves(
      scale.notes,
      startingOctave
    );

    for (let i = 0; i < playedNotes.length; i++) {
      if (
        `${playedNotes[i].label}${playedNotes[i].octave}` !== expectedNotes[i]
      ) {
        return false;
      }
    }

    const nextIndex = playedNotes.length;
    return `${key.label}${key.octave}` === expectedNotes[nextIndex];
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
    <PianoContext.Provider
      value={{
        showLabels,
        setShowLabels,
        showPlayed,
        setShowPlayed,
        showNext,
        setShowNext,
        playedNotes,
        setPlayedNotes,
        checkResponse,
        setCheckResponse,
        activeNotes,
        setActiveNotes,
        handleKeyClick,
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
        type,
        isTest,
      }}
    >
      {children}
      {!audioAllowed && <EnableAudioModal initAudio={initAudio} />}
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
