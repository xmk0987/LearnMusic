import React from "react";
import LessonCard from "@/components/lessonCard/LessonCard";
import CardGridLayout from "../layouts/CardGridLayout";

const LessonsPage = () => {
  return (
    <CardGridLayout title={"Lessons"}>
      <LessonCard />
    </CardGridLayout>
  );
};

export default LessonsPage;
