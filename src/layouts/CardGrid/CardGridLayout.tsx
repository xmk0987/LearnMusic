import React from "react";
import styles from "./CardGridLayout.module.css";

interface CardGridLayoutProps {
  children: React.ReactNode;
}

const CardGridLayout: React.FC<CardGridLayoutProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default CardGridLayout;
