"use server";
import mongoose from "mongoose";
import { MongoServerError } from "mongodb";

type ServerError = {
  errors: {
    server?: string;
  };
};

export async function handleErrors(error: unknown): Promise<ServerError> {
  if (error instanceof mongoose.Error.ValidationError) {
    return { errors: { server: `Validation error: ${error.message}` } };
  }

  if (error instanceof mongoose.Error.CastError) {
    return {
      errors: { server: `Invalid value for ${error.path}: ${error.value}` },
    };
  }

  if (error instanceof MongoServerError && error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "Field";
    return { errors: { server: `${field} is already taken` } };
  }

  if (error instanceof mongoose.Error) {
    return { errors: { server: `Mongoose error: ${error.message}` } };
  }

  if (error instanceof Error) {
    return { errors: { server: `Internal server error: ${error.message}` } };
  }

  return { errors: { server: "Unknown server error" } };
}
