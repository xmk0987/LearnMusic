"use client";
import { useState, useActionState, useEffect } from "react";
import NotificationList from "@/components/Notifications/NotificationList";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "../register/Register.module.css";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const { addNotification } = useNotifications();
  const { setUser } = useUser();
  const router = useRouter();
  const [state, loginAction, loading] = useActionState(login, undefined);
  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  useEffect(() => {
    if (state?.errors?.server) {
      addNotification(state.errors.server, "error", "register");
    }
    if (state?.success) {
      setUser(state.success.user);
      router.push("/chapters");
    }
  }, [state, addNotification, router, setUser]);

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <NotificationList target="login" />
      <form action={loginAction}>
        <div className={styles.formItem}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {state?.errors?.email && (
            <p className={styles.errorText}>{state.errors.email}</p>
          )}
        </div>
        <div className={styles.formItem}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {state?.errors?.password && (
            <p className={styles.errorText}>{state.errors.password}</p>
          )}
        </div>

        <PrimaryButton
          text="Login"
          type="submit"
          isDisabled={
            loading || formData.email === "" || formData.password === ""
          }
        />
      </form>
    </div>
  );
}
