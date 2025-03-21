import React from "react";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "./PianoCheck.module.css";
import { usePiano } from "@/context/PianoContext";
import PianoColorLabels from "./PianoColorLabels";

const PianoCheck = () => {
  const {
    checkResponse,
    resetNotes,
    goToNextExercise,
    isLastExercise,
    uiSettings,
    toggleSetting,
  } = usePiano();

  if (!checkResponse) return null;

  return (
    <>
      {uiSettings.showCheckModal ? (
        <div
          className="modalOverlay"
          onClick={() => toggleSetting("showCheckModal")}
        >
          <div className="modalContent">
            <p className={styles.message}>{checkResponse?.message}</p>
            <div className={styles.buttons}>
              <PrimaryButton
                text={"Try again"}
                onClick={resetNotes}
                color="red"
              />
              {checkResponse.completed && (
                <PrimaryButton
                  text={isLastExercise ? "Go back to lessons" : "Next exercise"}
                  onClick={goToNextExercise}
                  color="green"
                />
              )}
            </div>
            <PianoColorLabels />
          </div>
        </div>
      ) : (
        <PianoColorLabels />
      )}
    </>
  );
};

export default PianoCheck;
