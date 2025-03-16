import React from "react";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "./PianoCheck.module.css";
import { usePiano } from "@/context/PianoContext";

const PianoCheck = () => {
  const { checkResponse, resetNotes } = usePiano();

  if (!checkResponse) return null;

  return (
    <div className={styles.extraInfo}>
      <p className={styles.message}>{checkResponse?.message}</p>
      <PrimaryButton text={"Try again"} onClick={resetNotes} color="red" />
      <div className={styles.colorLabels}>
        <div>
          <span className={styles.greenLabel}></span> Correct
        </div>
        <div>
          <span className={styles.orangeLabel}></span> Wrong Position
        </div>
        <div>
          <span className={styles.redLabel}></span> Wrong Note
        </div>
      </div>
    </div>
  );
};

export default PianoCheck;
