"use client";
import React from "react";
import type { IconProps } from "@/types/icon.types";

const GoIcon: React.FC<IconProps> = ({ size = 24, color = "black" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={color}
    >
      <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
    </svg>
  );
};

export default GoIcon;
