"use client";
import React from "react";
import type { IconProps } from "@/types/icon.types";

const ChevronDownIcon: React.FC<IconProps> = ({
  size = 24,
  color = "black",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={color}
    >
      <path d="M480-360 280-560h400L480-360Z" />
    </svg>
  );
};

export default ChevronDownIcon;
