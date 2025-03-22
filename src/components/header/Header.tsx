"use client";
import React from "react";
import styles from "./Header.module.css";
import MenuIcon from "@/assets/icons/MenuIcon";
import { useSidebar } from "@/context/SidebarContext";

const Header = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <header className={styles.titleContainer}>
      <button onClick={toggleSidebar}>
        <MenuIcon />
      </button>
      <p className={styles.title}>LearnWithMe</p>
    </header>
  );
};

export default Header;
