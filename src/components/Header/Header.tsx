"use client";
import React from "react";
import styles from "./Header.module.css";
import MenuIcon from "@/assets/icons/MenuIcon";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { user, loading, logout } = useUser();

  return (
    <header className={styles.titleContainer}>
      <div className={styles.headerItems}>
        <button onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <p className={styles.title}>LearnWithMe</p>
      </div>
      <div className={styles.headerItems}>
        {!loading && (
          <nav>
            <ul>
              {!user ? (
                <>
                  <li>
                    <Link href={"/login"}>Login</Link>
                  </li>
                  <li className={styles.linkButton}>
                    <Link href={"/register"}>Register</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>{user.username}</li>
                  <li>
                    <PrimaryButton text="Logout" onClick={logout} />
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
