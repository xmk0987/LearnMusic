"use client";
import { useEffect } from "react";
import { useChaptersData } from "@/context/ChaptersContext";
import styles from "./CurrentChapterPage.module.css";
import ExercisesLayout from "@/app/layouts/Exercises/ExercisesLayout";
import ExerciseCard from "@/components/GridCards/Exercise/ExerciseCard";

const CurrentChapterPage = () => {
  const { currentChapter, goToExercise } = useChaptersData();

  useEffect(() => {
    if (window.location.hash) {
      const sectionId = decodeURIComponent(window.location.hash.substring(1));
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentChapter]);

  if (!currentChapter) return <h1>Loading current chapter...</h1>;

  return (
    <div className={styles.container}>
      <div>
        <h1>{currentChapter.name}</h1>
        <h2>{currentChapter.lesson.header}</h2>
      </div>
      {currentChapter.lesson.sections &&
        currentChapter.lesson.sections.map((section) => (
          <div
            key={section.title}
            id={section.title}
            className={styles.section}
          >
            <h3>{section.title}</h3>
            <p>{section.content}</p>
            {section.subsections &&
              section.subsections.map((subsection) => (
                <div key={subsection.title} className={styles.subsection}>
                  <h4>{subsection.title}</h4>
                  <p>{subsection.content}</p>
                </div>
              ))}
            {section.exercises && section.exercises && (
              <ExercisesLayout>
                {section.exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} goToExercise={goToExercise}/>
                ))}
              </ExercisesLayout>
            )}
          </div>
        ))}
    </div>
  );
};

export default CurrentChapterPage;
