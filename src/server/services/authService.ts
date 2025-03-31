import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { CustomError } from "@/lib/customError";

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
  const db = await getDb();
  const usersCollection = db.collection("users");

  // Check if the user already exists
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    throw new CustomError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await usersCollection.insertOne({
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return {
    id: newUser.insertedId,
    username,
    email,
  };
}
