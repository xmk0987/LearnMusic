import type { NextApiRequest, NextApiResponse } from "next";
import { registerUser } from "@/server/services/authService";
import { CustomError } from "@/lib/customError";

/**
 * API route for user registration
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await registerUser(username, email, password);
    return res.status(201).json({ user });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
