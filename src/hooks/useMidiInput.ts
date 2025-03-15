import { useEffect, useRef } from "react";
import { Key } from "@/types/piano.types";
import { KEYS } from "@/lib/pianoConfig";

// Helper: map MIDI note number to your Key object
const midiNoteToKey = (midiNote: number): Key | undefined => {
  return KEYS.find((key) => key.midiKey === midiNote);
};

export const useMidi = (
  onMidiKeyPress: (key: Key) => void,
  onStopMidiKeyPress: (key: Key) => void,
  resetNotes: () => void,
  checkExercise: () => void
) => {
  // Ref to track active (pressed) MIDI note numbers
  const activeNotes = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then((midiAccess) => {
          midiAccess.inputs.forEach((input) => {
            input.onmidimessage = (event: WebMidi.MIDIMessageEvent) => {
              const [status, data1, data2] = event.data;

              // Handle Note On: status 144 with velocity > 0
              if (status === 144 && data2 > 0) {
                // Only trigger if note is not already active
                if (!activeNotes.current.has(data1)) {
                  if (data1 === 85) {
                    activeNotes.current.add(data1);
                    setTimeout(() => {
                      resetNotes();
                    }, 100);
                  } else if (data1 === 87) {
                    activeNotes.current.add(data1);
                    setTimeout(() => {
                      checkExercise();
                    }, 100);
                  } else {
                    activeNotes.current.add(data1);
                    const key = midiNoteToKey(data1);
                    if (key) {
                      onMidiKeyPress(key);
                    }
                  }
                }
              }
              // Handle Note Off: status 128, or note on with velocity 0
              else if (status === 128 || (status === 144 && data2 === 0)) {
                if (activeNotes.current.has(data1)) {
                  activeNotes.current.delete(data1);
                  const key = midiNoteToKey(data1);
                  if (key) {
                    onStopMidiKeyPress(key);
                  }
                }
              }
            };
          });
        })
        .catch((err) => {
          console.error("Error accessing MIDI devices:", err);
        });
    } else {
      console.error("Web MIDI API is not supported in this browser.");
    }
  }, [checkExercise, onMidiKeyPress, onStopMidiKeyPress, resetNotes]);
};
