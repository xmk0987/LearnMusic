import bcrypt from "bcryptjs";
import { CustomError } from "@/lib/customError";
import User from "../dbModels/User";
import connectDB from "@/lib/db";
import { handleErrors } from "@/utils/errorHandler";

/**
 * Registers a new user with hashed password.
 * @param username - The username of the user
 * @param email - The user's email
 * @param password - Plain text password
 * @returns The newly created user (without password)
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  try {
    await connectDB();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new CustomError(
        400,
        existingUser.email === email
          ? "User with this email already exists"
          : "Username is already taken"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      id: newUser._id,
      username,
      email,
    };
  } catch (error) {
    handleErrors(error);
  }
}
