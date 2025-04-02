"use server";

import { z } from "zod";
import type { LoginResponse } from "@/types/responses/response.types";
import connectDB from "@/lib/db";
import { handleErrors } from "@/utils/errorHandler";
import { createSession } from "@/lib/session";
import User from "@/server/dbModels/User";
import type { PublicUser } from "@/types/user.types";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function login(
  _prevState: LoginResponse | undefined,
  formData: FormData
): Promise<LoginResponse> {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  try {
    await connectDB();

    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      return { errors: { email: ["User not found."] } };
    }

    const isPasswordValid = await existingUser.comparePassword(password);

    if (!isPasswordValid) {
      return { errors: { password: ["Invalid credentials."] } };
    }

    const user: PublicUser = existingUser.toPublicUser();

    await createSession(user.id);

    return {
      success: {
        message: `Welcome ${user.username}`,
        user,
      },
    };
  } catch (error) {
    return await handleErrors(error);
  }
}

export async function logout() {
  console.log("Log out");
}
