import type { NextApiRequest, NextApiResponse } from "next";
import { CustomError } from "@/lib/customError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password } = req.body;

    console.log("Email and password received", email, password);

    res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
