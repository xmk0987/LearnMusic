"use client";
import React from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/HeaderN/Header";
import styles from "./AppLayout.module.css";
import { useSidebar } from "@/context/SidebarContext";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className={styles.container}>
      <Header />

      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sbExpanded : ""
        }`}
      >
        {/* Sidebar is always in the DOM but hidden via CSS */}
        <div
          className={`${styles.sidebar} ${
            !isSidebarOpen ? styles.sbClosing : ""
          }`}
        >
          <Sidebar />
        </div>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
