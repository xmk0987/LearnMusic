import React from "react";
import styles from "./PianoCheck.module.css";

const PianoColorLabels = () => {
  return (
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
  );
};

export default PianoColorLabels;
