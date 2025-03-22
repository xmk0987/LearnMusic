"use client";
import React from "react";
import type { IconProps } from "@/types/icon.types";

const MenuIcon: React.FC<IconProps> = ({ size = 24, color = "black" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      fill={color}
    >
      <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
    </svg>
  );
};

export default MenuIcon;
