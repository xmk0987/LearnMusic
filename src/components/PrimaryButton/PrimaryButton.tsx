"use client";
import React from "react";
import styles from "./PrimaryButton.module.css";

interface PrimaryButtonProps {
  text: string;
  onClick: () => void;
  color?: string;
  isDisabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  onClick,
  color = "var(--accent)",
  isDisabled = false,
}) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      style={{ backgroundColor: color }}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
