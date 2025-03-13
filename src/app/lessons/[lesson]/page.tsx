"use client";
import { useEffect } from "react";
import CardGridLayout from "@/app/layouts/CardGridLayout";
import ExerciseCard from "@/components/exerciseCard/ExerciseCard";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { useParams, useRouter } from "next/navigation";

const LESSONS = ["scales"];

const LessonPage = () => {
  const router = useRouter();
  const { lesson } = useParams<{ lesson: string }>();

  useEffect(() => {
    if (!LESSONS.includes(lesson)) {
      router.push("/lessons");
    }
  }, [lesson, router]);

  if (!LESSONS.includes(lesson)) {
    return null;
  }

  return (
    <CardGridLayout title={capitalizeFirstLetter(lesson)}>
      <ExerciseCard />
    </CardGridLayout>
  );
};

export default LessonPage;
