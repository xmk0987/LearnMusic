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
    D: 2,
    "D#/Eb": 3,
    E: 4,
    F: 5,
    "F#/Gb": 6,
    G: 7,
    "G#/Ab": 8,
    A: 9,
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
