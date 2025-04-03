import mongoose, { Schema, Document } from "mongoose";

interface IChapter extends Document {
  name: string;
  lesson: {
    header: string;
    sections: {
      title: string;
      content: string;
      subsections?: { title: string; content: string }[];
      exercises?: mongoose.Types.ObjectId[];
    }[];
  };
}

const ChapterSchema = new Schema<IChapter>({
  name: { type: String, required: true },
  lesson: {
    header: { type: String, required: true },
    sections: [
      {
        _id: false,
        title: { type: String, required: true },
        content: { type: String, required: true },
        subsections: [
          {
            title: String,
            content: String,
            _id: false,
          },
        ],
        exercises: {
          type: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
          default: [],
        },
      },
    ],
    _id: false,
  },
});

export default mongoose.models.Chapter ||
  mongoose.model<IChapter>("Chapter", ChapterSchema);
