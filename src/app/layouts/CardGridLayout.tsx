import React from "react";
import styles from "./CardGridLayout.module.css";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs/DynamicBreadcrumbs";

interface CardGridLayoutProps {
  title: string;
  children: React.ReactNode;
}

const CardGridLayout: React.FC<CardGridLayoutProps> = ({ title, children }) => {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>

      <DynamicBreadcrumbs />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default CardGridLayout;
