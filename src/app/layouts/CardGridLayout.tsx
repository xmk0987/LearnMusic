import React from "react";
import styles from "./CardGridLayout.module.css";

interface CardGridLayoutProps {
  title: string;
  children: React.ReactNode;
}

const CardGridLayout: React.FC<CardGridLayoutProps> = ({ title, children }) => {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default CardGridLayout;
