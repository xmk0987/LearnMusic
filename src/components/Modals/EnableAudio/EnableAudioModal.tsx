// EnableAudioModal.tsx
"use client";
import { useEffect } from "react";

interface EnableAudioModalProps {
  initAudio: () => Promise<void>;
}

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  textAlign: "center",
  maxWidth: "90%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  cursor: "pointer",
};

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
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Enable Audio</h2>
        <p>Please allow audio for piano sounds and other effects.</p>
        <button onClick={initAudio} style={buttonStyle}>
          Enable Audio
        </button>
      </div>
    </div>
  );
};

export default EnableAudioModal;
