"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import type { Sampler } from "tone";

interface AudioContextValue {
  /**
   * Triggers the note attack (starts the note).
   * @param note - The note to trigger (e.g., "C4").
   */
  triggerAttack: (note: string) => Promise<void>;
  /**
   * Releases the note (stops the note).
   * @param note - The note to release (e.g., "C4").
   */
  triggerRelease: (note: string) => Promise<void>;
  /**
   * Initializes Tone.js and the sampler.
   * Must be triggered by a user gesture.
   */
  initAudio: () => Promise<void>;

  audioAllowed: boolean;
  audioAllowedRef: React.RefObject<boolean>;
}

const AudioCtx = createContext<AudioContextValue>({
  triggerAttack: async () => {},
  triggerRelease: async () => {},
  initAudio: async () => {},
  audioAllowed: false,
  audioAllowedRef: { current: false },
});

export const useAudioContext = () => useContext(AudioCtx);

export const AudioContextProvider = ({ children }: { children: ReactNode }) => {
  const [sampler, setSampler] = useState<Sampler | null>(null);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [samplerLoaded, setSamplerLoaded] = useState(false);

  // Refs to always hold the latest values.
  const samplerRef = useRef<Sampler | null>(null);
  const samplerLoadedRef = useRef<boolean>(false);
  const audioAllowedRef = useRef<boolean>(false);

  useEffect(() => {
    samplerRef.current = sampler;
  }, [sampler]);

  useEffect(() => {
    samplerLoadedRef.current = samplerLoaded;
  }, [samplerLoaded]);

  useEffect(() => {
    audioAllowedRef.current = audioAllowed;
  }, [audioAllowed]);

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

    // Create a mapping of note names to file names.
    const noteMapping: { [note: string]: string } = {};
    for (let midi = 60; midi <= 83; midi++) {
      const noteName = Tone.Frequency(midi, "midi").toNote();
      noteMapping[noteName] = `${midi}.wav`;
    }

    // Create and load the sampler.
    const loadedSampler = new Tone.Sampler({
      urls: noteMapping,
      baseUrl: "/pianoKeys/",
      onload: () => {
        console.log("Sampler loaded and ready to use.");
        setSamplerLoaded(true);
      },
    }).toDestination();

    setSampler(loadedSampler);
    setAudioAllowed(true);
  };

  // This useEffect listens for a user gesture if audio isn't allowed yet.
  useEffect(() => {
    if (!audioAllowed) {
      const handleUserGesture = async () => {
        await initAudio();
        document.removeEventListener("click", handleUserGesture, true);
        document.removeEventListener("touchstart", handleUserGesture, true);
      };

      document.addEventListener("click", handleUserGesture, true);
      document.addEventListener("touchstart", handleUserGesture, true);

      return () => {
        document.removeEventListener("click", handleUserGesture, true);
        document.removeEventListener("touchstart", handleUserGesture, true);
      };
    }
  }, [audioAllowed]);

  /**
   * Triggers the note attack.
   */
  const triggerAttack = async (note: string) => {
    if (!samplerRef.current || !audioAllowedRef.current) {
      console.warn("Sampler or audio not available even after initialization.");
      return;
    }
    samplerRef.current.triggerAttack(note);
  };

  /**
   * Triggers the note release.
   */
  const triggerRelease = async (note: string) => {
    if (!samplerRef.current || !audioAllowedRef.current) {
      console.warn("Sampler or audio not available even after initialization.");
      return;
    }
    samplerRef.current.triggerRelease(note);
  };

  return (
    <AudioCtx.Provider
      value={{
        triggerAttack,
        triggerRelease,
        initAudio,
        audioAllowed,
        audioAllowedRef,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
};

export default AudioContextProvider;
