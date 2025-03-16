// src/lib/toneSampler.ts
"use client";
import * as Tone from "tone";

let samplerInstance: Tone.Sampler | null = null;

/**
 * Returns the Tone.Sampler instance.
 * Ensures that it is created only once on the client.
 */
export const getSampler = async (): Promise<Tone.Sampler> => {
  if (!samplerInstance) {
    // Build note mapping from MIDI numbers (60 to 83) to note names.
    const noteMapping: { [note: string]: string } = {};
    for (let midi = 60; midi <= 83; midi++) {
      const noteName = Tone.Frequency(midi, "midi").toNote();
      noteMapping[noteName] = `${midi}.wav`;
    }

    samplerInstance = new Tone.Sampler({
      urls: noteMapping,
      baseUrl: "/pianoKeys/",
      onload: () => {
        console.log("Sampler loaded and ready to use.");
      },
    }).toDestination();
  }
  return samplerInstance;
};
