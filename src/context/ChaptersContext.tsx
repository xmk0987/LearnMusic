"use client";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PracticeType, Chapter } from "@/types/chapters.types";
import axios from "axios";

interface ChaptersContextValue {
  chapters: Chapter[];
  currentChapter?: Chapter;
  loading: boolean;
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

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedChapters = localStorage.getItem("chapters");
    if (storedChapters) {
      setChapters(JSON.parse(storedChapters));
      setLoading(false);
    } else {
      const fetchChapters = async () => {
        try {
          const response = await axios.get("/api/chapters");
          const chapters = response.data.chapters;
          setChapters(chapters);
          localStorage.setItem("chapters", JSON.stringify(chapters));
        } catch (error) {
          console.error("Error fetching chapters:", error);
          setChapters([]);
        } finally {
          setLoading(false);
        }
      };

      fetchChapters();
    }
  }, []);

  const currentChapter = useMemo(() => {
    if (chapters?.length === 0 || !chapterId) return undefined;
    return chapters.find((c) => c._id === chapterId);
  }, [chapters, chapterId]);

  const goToExercise = (
    exerciseId: string,
    type: PracticeType = "practice",
    chapterId = currentChapter?._id
  ) => {
    if (chapterId) {
      router.push(`/chapters/${chapterId}/${exerciseId}?type=${type}`);
    }
  };

  return (
    <ChaptersContext.Provider
      value={{ chapters, currentChapter, loading, goToExercise }}
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
