import mongoose from "mongoose";

// Comments are embedded directly in the video document since the spec
// says to ignore nested comments — this keeps reads/writes simple.
const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true }, // denormalized for fast display
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 100 },
    description: { type: String, default: "", maxlength: 5000 },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Music", "Gaming", "Education", "Sports", "News", "Entertainment", "Technology", "Other"],
      default: "Other",
    },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    dislikes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Supports the search-by-title feature.
videoSchema.index({ title: "text" });

export default mongoose.model("Video", videoSchema);
