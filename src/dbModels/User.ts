"use server";
import { Schema, Document, model, models, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";
import type { PublicUser } from "@/types/user.types";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
  toPublicUser: () => PublicUser;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username can be only 20 characters long"],
      validate: {
        validator: (value: string) =>
          !/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(
            value
          ),
        message: "Username must not contain emojis",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: [
        {
          validator: (value: string) => /[0-9]/.test(value),
          message: "Password must contain at least one number",
        },
        {
          validator: (value: string) => /[!@#$%^&*]/.test(value),
          message: "Password must contain at least one special character",
        },
        {
          validator: (value: string) => /[a-z]/.test(value),
          message: "Password must contain at least one lowercase letter",
        },
        {
          validator: (value: string) => /[A-Z]/.test(value),
          message: "Password must contain at least one uppercase letter",
        },
      ],
    },
  },
  { timestamps: true }
);

// Hash password before saving user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Compare passwords method
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.toPublicUser = function (): PublicUser {
  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
  };
};

const User = models.User || model<IUser>("User", UserSchema);

export default User;
