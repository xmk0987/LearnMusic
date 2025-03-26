"use client";
import { useRouter } from "next/navigation";
import "./globals.css";
import styles from "./Home.module.css";

export default function Home() {
  const router = useRouter();

  const goToLessons = () => {
    router.push("/chapters");
  };

  return (
    <>
      <h1 className={styles.title}>Welcome</h1>
      <button onClick={goToLessons}>Go to Chapters</button>
    </>
  );
}
