"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
  useCallback,
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

  loadingSampler: boolean;
  audioAllowed: boolean;
  audioAllowedRef: React.RefObject<boolean>;
}

const AudioCtx = createContext<AudioContextValue>({
  triggerAttack: async () => {},
  triggerRelease: async () => {},
  initAudio: async () => {},
  audioAllowed: false,
  loadingSampler: false,
  audioAllowedRef: { current: false },
});

export const useAudioContext = () => useContext(AudioCtx);

export const AudioContextProvider = ({ children }: { children: ReactNode }) => {
  const [sampler, setSampler] = useState<Sampler | null>(null);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [loadingSampler, setLoadingSampler] = useState(false);
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
  const initAudio = useCallback(async () => {
    if (loadingSampler) return;
    setLoadingSampler(true);
    try {
      const Tone = await import("tone");
      const toneContext = Tone.getContext();
      const rawContext = toneContext.rawContext;

      if (rawContext.state !== "suspended") {
        await rawContext.suspend(0);
      }
      await Tone.start();

      const noteMapping = Object.fromEntries(
        Array.from({ length: 24 }, (_, i) => {
          const midi = 60 + i;
          const noteName = Tone.Frequency(midi, "midi").toNote();
          return [noteName, `${midi}.wav`];
        })
      );

      const loadedSampler = new Tone.Sampler({
        urls: noteMapping,
        baseUrl: "/pianoKeys/",
        onload: () => {
          console.log("Sampler loaded.");
          setSamplerLoaded(true);
        },
      }).toDestination();

      setSampler(loadedSampler);
      setAudioAllowed(true);
    } catch (error) {
      console.error("Error initializing audio:", error);
    } finally {
      setLoadingSampler(false);
    }
  }, [loadingSampler]);

  // This useEffect listens for a user gesture if audio isn't allowed yet.
  useEffect(() => {
    if (!audioAllowed && !loadingSampler) {
      const handleUserGesture = async () => {
        if (!audioAllowedRef.current) {
          await initAudio();
        }
      };

      document.addEventListener("click", handleUserGesture, { once: true });
      document.addEventListener("touchstart", handleUserGesture, {
        once: true,
      });

      return () => {
        document.removeEventListener("click", handleUserGesture);
        document.removeEventListener("touchstart", handleUserGesture);
      };
    }
  }, [audioAllowed, initAudio, loadingSampler]);

  const triggerAttack = async (note: string | string[]) => {
    if (!samplerRef.current || !audioAllowedRef.current) {
      console.warn("Sampler not initialized.");
      return;
    }
    if (Array.isArray(note)) {
      note.forEach((n) => samplerRef.current?.triggerAttack(n));
    } else {
      samplerRef.current.triggerAttack(note);
    }
  };

  const triggerRelease = async (note: string | string[]) => {
    if (!samplerRef.current || !audioAllowedRef.current) {
      console.warn("Sampler not initialized.");
      return;
    }
    if (Array.isArray(note)) {
      note.forEach((n) => samplerRef.current?.triggerRelease(n));
    } else {
      samplerRef.current.triggerRelease(note);
    }
  };

  return (
    <AudioCtx.Provider
      value={{
        triggerAttack,
        triggerRelease,
        initAudio,
        audioAllowed,
        audioAllowedRef,
        loadingSampler,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
};

export default AudioContextProvider;
