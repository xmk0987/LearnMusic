"use client";
import { useChaptersData } from "@/context/ChaptersContext";
import { useState } from "react";
import styles from "./Sidebar.module.css";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { ChevronDownIcon, ChevronRightIcon } from "@/assets/icons";
import Link from "next/link";

const Sidebar = () => {
  const { chapters } = useChaptersData();

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

  return (
    <div className={styles.container}>
      <h2>Learn</h2>
      <nav className={styles.categories}>
        {chapters?.map((chapter) => (
          <div key={chapter._id} className={styles.items}>
            <div
              onClick={() => toggleChapters(chapter._id)}
              className={styles.sidebarItem}
            >
              <span
                className={expandedChapters.has(chapter._id) ? styles.bold : ""}
              >
                {capitalizeFirstLetter(chapter.name)}
              </span>
              <button>
                {expandedChapters.has(chapter._id) ? (
                  <ChevronDownIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </button>
            </div>
            {expandedChapters.has(chapter._id) && (
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
                            <Link
                              href={`/chapters/${
                                chapter._id
                              }#${encodeURIComponent(section.title)}`}
                            >
                              Go to Section
                            </Link>
                          </div>
                        </div>
                        {section.exercises?.length > 0 && (
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
                                  key={exercise._id}
                                  className={`${styles.items} `}
                                >
                                  <div className={`${styles.sidebarItem}`}>
                                    <Link
                                      href={`/chapters/${chapter._id}/${exercise._id}?type=practice`}
                                    >
                                      {exercise.title}
                                    </Link>
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
      </nav>
    </div>
  );
};

export default Sidebar;
