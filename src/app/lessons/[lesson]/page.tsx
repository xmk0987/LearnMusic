"use client";
import { useRouter, useParams } from "next/navigation";
import { useLessonsData } from "@/context/LessonsProvider";
import ExercisesLayout from "@/app/layouts/Exercises/ExercisesLayout";
import styles from "./Lesson.module.css";
import ExerciseCard from "@/components/ExerciseCard/ExerciseCard";

const LessonPage = () => {
  const { lesson } = useParams<{ lesson: string }>();
  const { getLessonById } = useLessonsData();
  const lessonContent = getLessonById(parseInt(lesson));
  const router = useRouter();

  const goToExercise = (exerciseId: number, type: "test" | "practice") => {
    router.push(`/lessons/${lesson}/${exerciseId}?type=${type}`);
  };

  if (!lessonContent) return null;

  return (
    <div className={styles.container}>
      <ExercisesLayout key={lessonContent.name} title={lessonContent.name}>
        {lessonContent.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.name}
            exercise={exercise}
            goToExercise={goToExercise}
          />
        ))}
      </ExercisesLayout>
    </div>
  );
};

export default LessonPage;
