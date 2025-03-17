export type KeyType = "white" | "black";

export interface Key {
  type: KeyType;
  label: string;
  octave: number;
  midiKey: number;
  keyboardKey: string;
}
