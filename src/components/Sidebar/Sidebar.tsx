"use client";
import { useChaptersData } from "@/context/ChaptersContext";
import { useState } from "react";
import styles from "./Sidebar.module.css";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { ChevronDownIcon, ChevronRightIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const { chapters, goToExercise } = useChaptersData();
  const router = useRouter();

  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(
    new Set()
  );

  const toggleChapters = (category: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleExercises = (sectionId: string) => {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const goToSection = (chapterId: string, sectionTitle: string) => {
    const encodedSectionTitle = encodeURIComponent(sectionTitle);
    router.push(`/chapters/${chapterId}#${encodedSectionTitle}`);
  };

  return (
    <div className={styles.container}>
      <h2>Learn</h2>
      <div className={styles.categories}>
        {chapters.map((chapter) => (
          <div key={chapter.id} className={styles.items}>
            <div
              onClick={() => toggleChapters(chapter.id)}
              className={styles.sidebarItem}
            >
              <span
                className={expandedChapters.has(chapter.id) ? styles.bold : ""}
              >
                {capitalizeFirstLetter(chapter.name)}
              </span>
              <button>
                {expandedChapters.has(chapter.id) ? (
                  <ChevronDownIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </button>
            </div>
            {expandedChapters.has(chapter.id) && (
              <div
                className={`${styles.items} ${styles.guideLine} ${styles.section}`}
              >
                {chapter.lesson.sections.map((section) => (
                  <div key={section.title} className={`${styles.items} `}>
                    <div
                      onClick={() => toggleSection(section.title)}
                      className={`${styles.sidebarItem}`}
                    >
                      <span
                        className={
                          expandedSections.has(section.title) ? styles.bold : ""
                        }
                      >
                        {capitalizeFirstLetter(section.title)}
                      </span>
                      <button>
                        {expandedSections.has(section.title) ? (
                          <ChevronDownIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </button>
                    </div>
                    {expandedSections.has(section.title) && (
                      <div
                        className={`${styles.items} ${styles.guideLine} ${styles.section}`}
                      >
                        <div className={`${styles.items} `}>
                          <div className={`${styles.sidebarItem}`}>
                            <button
                              onClick={() =>
                                goToSection(chapter.id, section.title)
                              }
                            >
                              Go to Section
                            </button>
                          </div>
                        </div>
                        {section.exercises && (
                          <div
                            onClick={() => toggleExercises(section.title)}
                            className={`${styles.sidebarItem}`}
                          >
                            <span
                              className={
                                expandedExercises.has(section.title)
                                  ? styles.bold
                                  : ""
                              }
                            >
                              Exercises
                            </span>
                            <button>
                              {expandedExercises.has(section.title) ? (
                                <ChevronDownIcon />
                              ) : (
                                <ChevronRightIcon />
                              )}
                            </button>
                          </div>
                        )}
                        {expandedExercises.has(section.title) &&
                          section.exercises && (
                            <div
                              className={`${styles.items} ${styles.guideLine} ${styles.section}`}
                            >
                              {section.exercises.map((exercise) => (
                                <div
                                  key={exercise.id}
                                  className={`${styles.items} `}
                                >
                                  <div className={`${styles.sidebarItem}`}>
                                    <button
                                      onClick={() =>
                                        goToExercise(
                                          exercise.id,
                                          "practice",
                                          chapter.id
                                        )
                                      }
                                    >
                                      {exercise.title}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
