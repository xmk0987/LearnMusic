"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type NotificationType = "info" | "success" | "error";
type NotificationTarget = "global" | "login" | "register";

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  target: NotificationTarget;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    message: string,
    type?: NotificationType,
    target?: NotificationTarget
  ) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    message: string,
    type: NotificationType = "info",
    target: NotificationTarget = "global"
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type, target }]);

    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom Hook to use notifications
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
