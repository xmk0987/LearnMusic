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
  { type: "white", label: `${WHITE_KEYS[0]}`, octave: 4 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[0].sharp}/${BLACK_KEY_NAMES[0].flat}`,
    octave: 4,
  },
  { type: "white", label: `${WHITE_KEYS[1]}`, octave: 4 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[1].sharp}/${BLACK_KEY_NAMES[1].flat}`,
    octave: 4,
  },
  { type: "white", label: `${WHITE_KEYS[2]}`, octave: 4 },
  { type: "white", label: `${WHITE_KEYS[3]}`, octave: 4 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[3].sharp}/${BLACK_KEY_NAMES[3].flat}`,
    octave: 4,
  },
  { type: "white", label: `${WHITE_KEYS[4]}`, octave: 4 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[4].sharp}/${BLACK_KEY_NAMES[4].flat}`,
    octave: 4,
  },
  { type: "white", label: `${WHITE_KEYS[5]}`, octave: 4 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[5].sharp}/${BLACK_KEY_NAMES[5].flat}`,
    octave: 4,
  },
  { type: "white", label: `${WHITE_KEYS[6]}`, octave: 4 },
  // Second octave (octave 5)
  { type: "white", label: `${WHITE_KEYS[0]}`, octave: 5 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[0].sharp}/${BLACK_KEY_NAMES[0].flat}`,
    octave: 5,
  },
  { type: "white", label: `${WHITE_KEYS[1]}`, octave: 5 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[1].sharp}/${BLACK_KEY_NAMES[1].flat}`,
    octave: 5,
  },
  { type: "white", label: `${WHITE_KEYS[2]}`, octave: 5 },
  { type: "white", label: `${WHITE_KEYS[3]}`, octave: 5 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[3].sharp}/${BLACK_KEY_NAMES[3].flat}`,
    octave: 5,
  },
  { type: "white", label: `${WHITE_KEYS[4]}`, octave: 5 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[4].sharp}/${BLACK_KEY_NAMES[4].flat}`,
    octave: 5,
  },
  { type: "white", label: `${WHITE_KEYS[5]}`, octave: 5 },
  {
    type: "black",
    label: `${BLACK_KEY_NAMES[5].sharp}/${BLACK_KEY_NAMES[5].flat}`,
    octave: 5,
  },
  { type: "white", label: `${WHITE_KEYS[6]}`, octave: 5 },
];
