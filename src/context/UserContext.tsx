"use client";
import axios from "axios";
import useSWR from "swr";
import { createContext, useContext, useCallback } from "react";
import type { PublicUser } from "@/types/user.types";

interface UserContextType {
  user: PublicUser | null;
  loading: boolean;
  logout: () => void;
  setUser: (user: PublicUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const fetcher = (url: string) => axios.get(url).then((res) => res.data.user);

export function UserProvider({ children }: { children: React.ReactNode }) {
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
    (userData: PublicUser | null) => mutate(userData, false),
    [mutate]
  );

  const logout = useCallback(async () => {
    try {
      const response = await axios.get("/api/logout");
      if (response.data.success) {
        mutate(null, false);
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

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
