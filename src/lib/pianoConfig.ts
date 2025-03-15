// pianoConfig.ts
import { Key } from "@/types/piano.types";

export const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];

export const BLACK_KEY_NAMES: {
  [key: number]: { sharp: string; flat: string };
} = {
  0: { sharp: "C#", flat: "Db" },
  1: { sharp: "D#", flat: "Eb" },
  3: { sharp: "F#", flat: "Gb" },
  4: { sharp: "G#", flat: "Ab" },
  5: { sharp: "A#", flat: "Bb" },
};

export const KEYS: Key[] = [
  { type: "white", label: `${WHITE_KEYS[0]}`, octave: 4, midiKey: 60 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[0].sharp}/${BLACK_KEY_NAMES[0].flat}`,
    octave: 4,
    midiKey: 61,
  },
  { type: "white", label: `${WHITE_KEYS[1]}`, octave: 4, midiKey: 62 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[1].sharp}/${BLACK_KEY_NAMES[1].flat}`,
    octave: 4,
    midiKey: 63,
  },
  { type: "white", label: `${WHITE_KEYS[2]}`, octave: 4, midiKey: 64 },
  { type: "white", label: `${WHITE_KEYS[3]}`, octave: 4, midiKey: 65 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[3].sharp}/${BLACK_KEY_NAMES[3].flat}`,
    octave: 4,
    midiKey: 66,
  },
  { type: "white", label: `${WHITE_KEYS[4]}`, octave: 4, midiKey: 67 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[4].sharp}/${BLACK_KEY_NAMES[4].flat}`,
    octave: 4,
    midiKey: 68,
  },
  { type: "white", label: `${WHITE_KEYS[5]}`, octave: 4, midiKey: 69 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[5].sharp}/${BLACK_KEY_NAMES[5].flat}`,
    octave: 4,
    midiKey: 70,
  },
  { type: "white", label: `${WHITE_KEYS[6]}`, octave: 4, midiKey: 71 },
  // Second octave (octave 5)
  { type: "white", label: `${WHITE_KEYS[0]}`, octave: 5, midiKey: 72 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[0].sharp}/${BLACK_KEY_NAMES[0].flat}`,
    octave: 5,
    midiKey: 73,
  },
  { type: "white", label: `${WHITE_KEYS[1]}`, octave: 5, midiKey: 74 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[1].sharp}/${BLACK_KEY_NAMES[1].flat}`,
    octave: 5,
    midiKey: 75,
  },
  { type: "white", label: `${WHITE_KEYS[2]}`, octave: 5, midiKey: 76 },
  { type: "white", label: `${WHITE_KEYS[3]}`, octave: 5, midiKey: 77 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[3].sharp}/${BLACK_KEY_NAMES[3].flat}`,
    octave: 5,
    midiKey: 78,
  },
  { type: "white", label: `${WHITE_KEYS[4]}`, octave: 5, midiKey: 79 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[4].sharp}/${BLACK_KEY_NAMES[4].flat}`,
    octave: 5,
    midiKey: 80,
  },
  { type: "white", label: `${WHITE_KEYS[5]}`, octave: 5, midiKey: 81 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[5].sharp}/${BLACK_KEY_NAMES[5].flat}`,
    octave: 5,
    midiKey: 82,
  },
  { type: "white", label: `${WHITE_KEYS[6]}`, octave: 5, midiKey: 83 },
];
