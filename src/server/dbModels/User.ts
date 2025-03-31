import { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
