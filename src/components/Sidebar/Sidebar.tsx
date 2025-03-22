"use client";
import { useLessonsData } from "@/context/LessonsContext";
import { Exercise, Lesson } from "@/types/lessons.types";
import { useState } from "react";
import styles from "./Sidebar.module.css";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { ChevronDownIcon, ChevronRightIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const { groupedLessons } = useLessonsData();
  const router = useRouter();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(
    new Set()
  );
  const [expandedLessonExercises, setExpandedLessonExercises] = useState<
    Set<number>
  >(new Set());

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleLesson = (lessonId: number) => {
    setExpandedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const toggleLessonExercises = (lessonId: number) => {
    setExpandedLessonExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const goToLesson = (lessonId: number) => {
    router.push("/lessons/" + lessonId);
  };

  const goToExercise = (lessonId: number, exerciseId: number) => {
    router.push("/lessons/" + lessonId + "/" + exerciseId + "?type=practice");
  };

  return (
    <div className={styles.container}>
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
                  className={
                    expandedCategories.has(category) ? styles.bold : ""
                  }
                >
                  {capitalizeFirstLetter(category)}
                </span>
                <button>
                  {expandedCategories.has(category) ? (
                    <ChevronDownIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </button>
              </div>
              {expandedCategories.has(category) && (
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
                            expandedLessons.has(lesson.id) ? styles.bold : ""
                          }
                        >
                          {lesson.name}
                        </span>
                        <button>
                          {expandedLessons.has(lesson.id) ? (
                            <ChevronDownIcon />
                          ) : (
                            <ChevronRightIcon />
                          )}
                        </button>
                      </div>
                      {expandedLessons.has(lesson.id) && (
                        <div
                          className={`${styles.items} ${styles.exercises} ${styles.guideLine}`}
                        >
                          <button
                            className={styles.goTo}
                            onClick={() => goToLesson(lesson.id)}
                          >
                            Go to lesson
                          </button>
                          <div
                            onClick={() => toggleLessonExercises(lesson.id)}
                            className={styles.lesson}
                          >
                            <span
                              className={
                                expandedLessonExercises.has(lesson.id)
                                  ? styles.bold
                                  : ""
                              }
                            >
                              Exercises
                            </span>
                            <button>
                              {expandedLessonExercises.has(lesson.id) ? (
                                <ChevronDownIcon />
                              ) : (
                                <ChevronRightIcon />
                              )}
                            </button>
                          </div>
                          {expandedLessonExercises.has(lesson.id) && (
                            <ul
                              className={`${styles.items} ${styles.exercises} ${styles.guideLine}`}
                            >
                              {lesson.exercises.map((exercise: Exercise) => (
                                <li
                                  className={styles.exercise}
                                  onClick={() =>
                                    goToExercise(lesson.id, exercise.id)
                                  }
                                  key={exercise.id}
                                >
                                  {exercise.name}
                                </li>
                              ))}
                            </ul>
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
