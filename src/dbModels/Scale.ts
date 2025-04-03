import { NoteValue } from "@/types/piano.types";
import mongoose, { Schema, Document } from "mongoose";

interface IScale extends Document {
  name: string;
  notes: NoteValue[];
}

const ScaleSchema = new Schema<IScale>({
  name: { type: String, required: true },
  notes: [{ type: String, required: true }],
});

export default mongoose.models.Scale ||
  mongoose.model<IScale>("Scale", ScaleSchema);
