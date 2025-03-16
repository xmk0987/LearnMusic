"use client";
import React from "react";
import styles from "./PianoKeys.module.css";
import { KEYS } from "@/lib/pianoConfig";
import PianoKey from "./PianoKey";

const PianoKeys = () => {
  return (
    <div className={styles.piano}>
      {KEYS.map((key, i) => (
        <PianoKey key={i} keyData={key} />
      ))}
    </div>
  );
};

export default PianoKeys;
