"use client";

import axios from "axios";
import useSWR from "swr";
import { createContext, useContext, useCallback, ReactNode } from "react";
import type { PublicUser } from "@/types/user.types";

interface UserContextType {
  user: PublicUser | null | undefined;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: PublicUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const fetcher = async (url: string): Promise<PublicUser | null> => {
  const res = await axios.get(url);
  return res.data.user ?? null;
};

export function UserProvider({ children }: { children: ReactNode }) {
  const {
    data: user,
    isLoading: loading,
    mutate,
  } = useSWR("/api/user", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const setUser = useCallback(
    (userData: PublicUser | null) => {
      mutate(userData, false);
    },
    [mutate]
  );

  const logout = useCallback(async () => {
    try {
      const response = await axios.get("/api/logout");
      if (response.data.success) {
        await mutate(null, false);
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [mutate]);

  return (
    <UserContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
