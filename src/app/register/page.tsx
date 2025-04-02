"use client";
import styles from "./Register.module.css";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import { registerUser } from "./actions";
import NotificationList from "@/components/Notifications/NotificationList";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { addNotification } = useNotifications();
  const router = useRouter();

  const [state, formAction, pending] = useActionState(registerUser, undefined);
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (state?.errors?.server) {
      addNotification(state.errors.server, "error", "register");
    }
    if (state?.success) {
      addNotification(state.success, "success", "login");
      router.push("/login");
    }
  }, [state, addNotification, router]);

  return (
    <div className={styles.container}>
      <h1>Register</h1>
      <NotificationList target="register" />
      <form action={formAction}>
        <div className={styles.formItem}>
          <input
            type="text"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className={state?.errors?.username ? styles.inputError : ""}
          />
          {state?.errors?.username && (
            <p className={styles.errorText}>{state.errors.username}</p>
          )}
        </div>

        <div className={styles.formItem}>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className={state?.errors?.email ? styles.inputError : ""}
          />
          {state?.errors?.email && (
            <p className={styles.errorText}>{state.errors.email}</p>
          )}
        </div>

        <div className={styles.formItem}>
          <input
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className={state?.errors?.password ? styles.inputError : ""}
          />
          {state?.errors?.password && (
            <p className={styles.errorText}>{state.errors.password}</p>
          )}
        </div>

        <PrimaryButton
          text={pending ? "Pending..." : "Register"}
          type="submit"
          isDisabled={
            pending ||
            formValues.email === "" ||
            formValues.username === "" ||
            formValues.password === ""
          }
        />
      </form>
    </div>
  );
}
