"use client";
import React from "react";
import styles from "./PrimaryButton.module.css";

interface PrimaryButtonProps {
  text: string;
  onClick?: () => void;
  color?: string;
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  onClick,
  color = "var(--accent)",
  isDisabled = false,
  type = "button",
}) => {
  return (
    <button
      className={styles.button}
      onClick={type !== "submit" ? onClick : undefined}
      style={{ backgroundColor: color }}
      disabled={isDisabled}
      type={type}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
