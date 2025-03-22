"use client";
import { useRouter } from "next/navigation";
import { useLessonsData } from "@/context/LessonsContext";
import ExercisesLayout from "@/app/layouts/Exercises/ExercisesLayout";
import ExerciseCard from "@/components/GridCards/Exercise/ExerciseCard";

const LessonPage = () => {
  const { currentLesson } = useLessonsData();
  const router = useRouter();

  const goToExercise = (exerciseId: number, type: "test" | "practice") => {
    router.push(`/lessons/${currentLesson?.id}/${exerciseId}?type=${type}`);
  };

  if (!currentLesson) return <h1>Loading lesson...</h1>;

  return (
    <ExercisesLayout key={currentLesson.name}>
      {currentLesson.exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.name}
          exercise={exercise}
          goToExercise={goToExercise}
        />
      ))}
    </ExercisesLayout>
  );
};

export default LessonPage;
