import type { NoteValue } from "@/types/lessons.types";

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// Helper to calculate expected note strings with correct octaves
export const calculateExpectedNotesWithOctaves = (
  notes: string[],
  startingOctave: number
): string[] => {
  const noteMap: { [key: string]: number } = {
    C: 0,
    "C#/Db": 1,
    "C#": 1,

    D: 2,
    "D#": 3,
    "D#/Eb": 3,
    E: 4,
    "E#": 5,
    F: 5,
    "F#": 6,
    "F#/Gb": 6,
    G: 7,
    "G#": 8,
    "G#/Ab": 8,
    A: 9,
    "A#": 10,
    "A#/Bb": 10,
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

export const getNoteObjects = (notes: string[], useFlats = false) => {
  const notesWithOctaves = calculateExpectedNotesWithOctaves(notes, 4);

  return notesWithOctaves.map((note: string, index) => {
    const match = note.match(/([A-G]#?b?\/?[A-G]?#?b?)(\d)/);
    if (!match) {
      throw new Error(`Invalid note format: ${note}`);
    }
    const [, noteName, octave] = match;

    let noteNameToUse = noteName;
    if (noteName.includes("/")) {
      const [sharpNote, flatNote] = noteName.split("/");
      if (useFlats === true) {
        noteNameToUse = flatNote;
      } else {
        noteNameToUse = sharpNote;
      }
    }

    return {
      noteName: noteNameToUse as NoteValue,
      octave: parseInt(octave, 10),
      position: index + 2,
      value: note,
      index: index,
    };
  });
};
