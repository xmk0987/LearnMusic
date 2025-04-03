"use client";
import { createContext, useContext, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Chapter, PracticeType } from "@/types/chapters.types";
import chaptersData from "@/data/chapters.json";

interface ChaptersContextValue {
  chapters: Chapter[];
  currentChapter?: Chapter;
  goToExercise: (
    exerciseId: string,
    type?: PracticeType,
    chapterId?: string
  ) => void;
}

interface ChaptersProviderProps {
  children: React.ReactNode;
}

const ChaptersContext = createContext<ChaptersContextValue | undefined>(
  undefined
);

export const ChaptersProvider: React.FC<ChaptersProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { chapterId } = useParams<{ chapterId: string }>();

  const chapters = useMemo(() => chaptersData.chapters as Chapter[], []);

  const currentChapter = useMemo(
    () => chapters.find((c) => c.id === chapterId),
    [chapters, chapterId]
  );

  const goToExercise = (
    exerciseId: string,
    type: PracticeType = "practice",
    chapterId = currentChapter?.id
  ) => {
    if (chapterId) {
      router.push(`/chapters/${chapterId}/${exerciseId}?type=${type}`);
    }
  };

  return (
    <ChaptersContext.Provider
      value={{ chapters, currentChapter, goToExercise }}
    >
      {children}
    </ChaptersContext.Provider>
  );
};

export const useChaptersData = () => {
  const context = useContext(ChaptersContext);
  if (!context) {
    throw new Error("useChaptersData must be used within a ChaptersProvider");
  }
  return context;
};
