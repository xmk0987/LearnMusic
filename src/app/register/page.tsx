"use client";
import styles from "./Register.module.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useNotifications } from "@/context/NotificationContext";
import NotificationList from "@/components/Notifications/NotificationList";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";

export default function RegisterPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        addNotification(
          "Registration successful! You can now log in.",
          "success",
          "login"
        );
        router.push("/login");
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
      <h1>Register</h1>
      <NotificationList target="register" />
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <PrimaryButton text="Register" type="submit" isDisabled={loading} />
      </form>
    </div>
  );
}
