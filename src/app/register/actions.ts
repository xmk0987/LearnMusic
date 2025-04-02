"use server";
import { z } from "zod";
import User from "@/dbModels/User";
import connectDB from "@/lib/db";
import { handleErrors } from "@/utils/errorHandler";
import type { RegisterResponse } from "@/types/responses/response.types";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(20, "Username can only be 20 characters long.")
    .regex(
      /^[^\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u,
      "Username must not contain emojis."
    ),
  email: z.string().email("Invalid email format."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character."
    )
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter."),
});

export async function registerUser(
  _prevState: RegisterResponse | undefined,
  formData: FormData
): Promise<RegisterResponse> {
  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = result.data;

  try {
    await connectDB();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return {
        errors: {
          username:
            existingUser.username === username
              ? ["Username already taken."]
              : undefined,
          email:
            existingUser.email === email
              ? ["Email already registered."]
              : undefined,
        },
      };
    }

    await User.create({ username, email, password });

    return { success: "Registration successful! You can now login!" };
  } catch (error) {
    return await handleErrors(error);
  }
}
