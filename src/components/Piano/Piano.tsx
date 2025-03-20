"use client";
import PianoKeys from "./Keys/PianoKeys";
import { PianoOptions } from "./Options/PianoOptions";
import React from "react";
import styles from "./Piano.module.css";
import PianoCheck from "./Check/PianoCheck";
import { PianoProvider } from "@/context/PianoContext";
import NoteSheet from "../NoteSheet/NoteSheet";

const Piano = () => {
  return (
    <PianoProvider>
      <div className={styles.container}>
        <NoteSheet />
        <PianoOptions />
        <PianoKeys />
        <PianoCheck />
      </div>
    </PianoProvider>
  );
};

export default Piano;
