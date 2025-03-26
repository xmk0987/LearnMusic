"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Chapter, PracticeType } from "@/types/chapters.types";
import chaptersData from "@/lessons/chapters.json";

interface ChaptersContextValue {
  chapters: Chapter[];
  currentChapter: Chapter | undefined;
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
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { chapterId } = useParams<{ chapterId: string }>();

  useEffect(() => {
    setChapters(chaptersData.chapters as Chapter[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (chapterId) {
      setLoading(true);
      const foundChapter = chapters.find((c) => c.id === chapterId);
      setCurrentChapter(foundChapter);
      if (foundChapter) {
        setCurrentChapter(foundChapter);
        setError(null);
      } else {
        setError("Chapter not found");
      }
      setLoading(false);
    }
  }, [chapterId, chapters]);

  const goToExercise = (
    exerciseId: string,
    type = "practice",
    chapterId = currentChapter?.id
  ) => {
    router.push(`/chapters/${chapterId}/${exerciseId}?type=${type}`);
  };

  if (loading) return <h1>Loading chapters</h1>;

  if (error) {
    return <h1>{error || "Chapter not found"}</h1>;
  }

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
  if (context === undefined) {
    throw new Error("useChaptersData must be used within a ChaptersProvider");
  }
  return context;
};
