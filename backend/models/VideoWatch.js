import mongoose from "mongoose";

const videoWatchSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  watchTime: { type: Number, default: 0 }, // in seconds
  lastWatchedAt: { type: Date, default: Date.now },
});

const VideoWatch = mongoose.model("VideoWatch", videoWatchSchema);

export default VideoWatch;
