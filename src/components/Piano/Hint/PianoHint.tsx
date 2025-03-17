import { usePiano } from "@/context/PianoContext";
import React from "react";
import styles from "./PianoHint.module.css"

interface PianoHintProps {
  hint: string;
}
const PianoHint: React.FC<PianoHintProps> = ({ hint }) => {
  const { showHint } = usePiano();

  return <>{showHint && <p className={styles.hint}>{hint}</p>}</>;
};

export default PianoHint;
