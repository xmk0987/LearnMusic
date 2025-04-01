"use client";
import React from "react";
import styles from "./Header.module.css";
import MenuIcon from "@/assets/icons/MenuIcon";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";

const Header = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <header className={styles.titleContainer}>
      <div className={styles.headerItems}>
        <button onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <p className={styles.title}>LearnWithMe</p>
      </div>
      <div className={styles.headerItems}>
        <nav>
          <ul>
            <li>
              <Link href={"/login"}>Login</Link>
            </li>
            <li>
              <Link href={"/register"}>Register</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
