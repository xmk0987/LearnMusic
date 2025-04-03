import mongoose, { Schema, Document } from "mongoose";
import { ExerciseTypes } from "@/types/chapters.types";

interface IExercise extends Document {
  title: string;
  type: ExerciseTypes;
  task: string;
  tip?: string;
  notes?: string[];
  scale?: mongoose.Types.ObjectId;
}

const ExerciseSchema = new Schema<IExercise>({
  title: { type: String, required: true },
  type: { type: String, required: true },
  task: { type: String, required: true },
  tip: { type: String },
  notes: {
    type: [String],
    validate: {
      validator: function (v: string[]) {
        return this.type === "play_single_note" ||
          this.type === "play_single_note_stave"
          ? v && v.length > 0
          : true;
      },
      message:
        "Notes must be provided for play_single_note and play_single_note_stave exercises.",
    },
  },
  scale: { type: Schema.Types.ObjectId, ref: "Scale", default: null },
});

export default mongoose.models.Exercise ||
  mongoose.model<IExercise>("Exercise", ExerciseSchema);
