// AudioContextProvider.tsx
"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import type { Sampler } from "tone";

interface AudioContextValue {
  playNote: (note: string, duration?: string) => Promise<void>;
  initAudio: () => Promise<void>;
  audioAllowed: boolean;
}

const AudioCtx = createContext<AudioContextValue>({
  playNote: async () => {},
  initAudio: async () => {},
  audioAllowed: false,
});

export const useAudioContext = () => useContext(AudioCtx);

export const AudioContextProvider = ({ children }: { children: ReactNode }) => {
  const [sampler, setSampler] = useState<Sampler | null>(null);
  const [audioAllowed, setAudioAllowed] = useState(false);

  /**
   * Initializes Tone.js and the sampler.
   * Must be triggered by a user gesture.
   */
  const initAudio = async () => {
    const Tone = await import("tone");

    const toneContext = Tone.getContext();
    const rawContext = toneContext.rawContext;
    if (rawContext.state !== "suspended") {
      await rawContext.suspend(0);
    }

    await Tone.start();
    console.log("Audio context started");

    const noteMapping: { [note: string]: string } = {};
    for (let midi = 60; midi <= 83; midi++) {
      const noteName = Tone.Frequency(midi, "midi").toNote();
      noteMapping[noteName] = `${midi}.wav`;
    }

    const loadedSampler = new Tone.Sampler({
      urls: noteMapping,
      baseUrl: "/pianoKeys/",
      onload: () => {
        console.log("Sampler loaded and ready to use.");
      },
    }).toDestination();

    setSampler(loadedSampler);
    setAudioAllowed(true);
  };

  useEffect(() => {
    if (!audioAllowed) {
      const handleUserGesture = async () => {
        await initAudio();
        document.removeEventListener("click", handleUserGesture, true);
        document.removeEventListener("touchstart", handleUserGesture, true);
      };

      // Attach event listeners to unlock the audio context on first user interaction.
      document.addEventListener("click", handleUserGesture, true);
      document.addEventListener("touchstart", handleUserGesture, true);

      return () => {
        document.removeEventListener("click", handleUserGesture, true);
        document.removeEventListener("touchstart", handleUserGesture, true);
      };
    }
  });

  /**
   * Plays a note using the loaded sampler.
   * Assumes that initAudio() has been called.
   *
   * @param note - The note to play (e.g., "C4")
   * @param duration - The note's duration (default "8n")
   */
  const playNote = async (note: string, duration: string = "8n") => {
    if (!sampler) {
      console.warn("Audio not initialized. Please enable audio first.");
      return;
    }
    sampler.triggerAttackRelease(note, duration);
  };

  return (
    <AudioCtx.Provider value={{ playNote, initAudio, audioAllowed }}>
      {children}
    </AudioCtx.Provider>
  );
};

export default AudioContextProvider;
