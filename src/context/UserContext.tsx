"use client";
import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import type { PublicUser } from "@/types/user.types";

interface UserContextType {
  user: PublicUser | null;
  setUser: Dispatch<SetStateAction<PublicUser | null>>;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/user")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    axios
      .get("/api/logout")
      .then((response) => {
        if (response.data.success) {
          setUser(null);
        } else {
          console.error("Logout failed");
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout }}>
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
