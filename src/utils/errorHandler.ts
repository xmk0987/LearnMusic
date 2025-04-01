import { CustomError } from "@/lib/customError";
import mongoose from "mongoose";
import { MongoServerError } from "mongodb";

export function handleErrors(error: unknown) {
  if (error instanceof CustomError) {
    throw error; // Preserve the original CustomError and rethrow it
  }

  if (error instanceof mongoose.Error.ValidationError) {
    throw new CustomError(400, error.message);
  }

  if (error instanceof mongoose.Error.CastError) {
    throw new CustomError(
      400,
      `Invalid value for ${error.path}: ${error.value}`
    );
  }

  if (error instanceof MongoServerError && error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "Field";
    throw new CustomError(400, `${field} is already taken`);
  }

  if (error instanceof mongoose.Error) {
    throw new CustomError(500, `Mongoose error: ${error.message}`);
  }

  if (error instanceof Error) {
    throw new CustomError(500, `Internal server error: ${error.message}`);
  }

  throw new CustomError(500, "Unknown server error");
}
