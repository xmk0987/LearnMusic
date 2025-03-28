import type { NoteValue } from "@/types/piano.types";

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// Helper to calculate expected note strings with correct octaves
export const calculateExpectedNotesWithOctaves = (
  notes: NoteValue[],
  startingOctave: number
): string[] => {
  const noteMap: { [key: string]: number } = {
    C: 0,
    "C#": 1,
    "C#/Db": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    "D#/Eb": 3,
    Eb: 3,
    E: 4,
    "E#": 5,
    F: 5,
    "F#": 6,
    "F#/Gb": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    "G#/Ab": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    "A#/Bb": 10,
    Bb: 10,
    B: 11,
  };

  let currentOctave = startingOctave;
  let previousPitch = noteMap[notes[0]];
  return notes.map((note, index) => {
    const currentPitch = noteMap[note];
    if (index > 0 && currentPitch <= previousPitch) {
      currentOctave++;
    }
    previousPitch = currentPitch;
    return `${note}${currentOctave}`;
  });
};

export const getNoteObjects = (notes: string[]) => {
  return notes.map((note: string, index) => {
    const match = note.match(/([A-G]#?b?\/?[A-G]?#?b?)(\d)/);
    if (!match) {
      throw new Error(`Invalid note format: ${note}`);
    }
    const [, noteName, octave] = match;

    return {
      noteName: noteName as NoteValue,
      octave: parseInt(octave, 10),
      position: index + 2,
      value: note,
      index: index,
    };
  });
};

// Function to get state from sessionStorage
export const getSessionStorage = (key: string, defaultValue: unknown) => {
  const storedValue = sessionStorage.getItem(key);
  return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
};

export const setSessionStorage = (key: string, value: unknown) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
};
