"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";
import NotificationList from "@/components/Notifications/NotificationList";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import axios from "axios";
import styles from "../register/Register.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (response.status === 201) {
        router.push("/chapters");
      }
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Registration failed";
      addNotification(errorMessage, "error", "register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <NotificationList target="login" />
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <PrimaryButton text="Login" type="submit" isDisabled={loading} />
      </form>
    </div>
  );
}
