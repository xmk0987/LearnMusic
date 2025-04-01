import { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
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
        validator: (value: string) => !/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(value),
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
      match: [
        /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Password must contain at least one number and one special character",
      ],
    },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
