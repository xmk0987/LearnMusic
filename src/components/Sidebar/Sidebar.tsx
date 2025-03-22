"use client";
import { useLessonsData } from "@/context/LessonsContext";
import { Exercise, Lesson } from "@/types/lessons.types";
import { useState } from "react";
import styles from "./Sidebar.module.css";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { ChevronDownIcon, ChevronRightIcon } from "@/assets/icons";

const Sidebar = () => {
  const { groupedLessons } = useLessonsData();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
    setExpandedLesson(null); // Reset lesson selection when changing category
  };

  const toggleLesson = (lessonId: number) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  return (
    <div className={styles.container}>
      <>
        <h2>Learn</h2>
        <div className={styles.categories}>
          {groupedLessons &&
            Object.entries(groupedLessons).map(([category, lessons]) => (
              <div key={category} className={styles.items}>
                <div
                  onClick={() => toggleCategory(category)}
                  className={styles.category}
                >
                  <span
                    className={expandedCategory === category ? styles.bold : ""}
                  >
                    {capitalizeFirstLetter(category)}
                  </span>
                  <button>
                    {expandedCategory === category ? (
                      <ChevronDownIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </button>
                </div>
                {expandedCategory === category && (
                  <div
                    className={`${styles.items} ${styles.guideLine} ${styles.lessons}`}
                  >
                    {lessons?.map((lesson: Lesson) => (
                      <div key={lesson.id} className={`${styles.items}`}>
                        <div
                          onClick={() => toggleLesson(lesson.id)}
                          className={styles.lesson}
                        >
                          <span
                            className={
                              expandedLesson === lesson.id ? styles.bold : ""
                            }
                          >
                            {lesson.name}
                          </span>
                          <button>
                            {expandedLesson === lesson.id ? (
                              <ChevronDownIcon />
                            ) : (
                              <ChevronRightIcon />
                            )}
                          </button>
                        </div>
                        {expandedLesson === lesson.id && (
                          <ul
                            className={`${styles.items} ${styles.exercises}  ${styles.guideLine}`}
                          >
                            {lesson.exercises.map((exercise: Exercise) => (
                              <li className={styles.exercise} key={exercise.id}>
                                {exercise.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </>
    </div>
  );
};

export default Sidebar;
