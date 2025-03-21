// EnableAudioModal.tsx
"use client";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import { useEffect } from "react";

interface EnableAudioModalProps {
  initAudio: () => Promise<void>;
}

const EnableAudioModal: React.FC<EnableAudioModalProps> = ({ initAudio }) => {
  useEffect(() => {
    // Attach a one-time event listener for any click to trigger audio initialization.
    const handleAnyClick = async () => {
      await initAudio();
    };

    window.addEventListener("click", handleAnyClick, { once: true });
    return () => {
      window.removeEventListener("click", handleAnyClick);
    };
  }, [initAudio]);

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Enable Audio</h2>
        <p>Please allow audio for piano sounds and other effects.</p>
        <PrimaryButton text="Enable Audio" onClick={initAudio} />
      </div>
    </div>
  );
};

export default EnableAudioModal;
