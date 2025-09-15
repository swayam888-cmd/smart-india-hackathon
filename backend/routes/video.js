import express from "express";
import multer from "multer";
import path from "path";
import Video from "../models/Video.js"; // Make sure your model is also ESM
import VideoWatch from "../models/VideoWatch.js";

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// POST: Upload Video
router.post("/", upload.single("videoFile"), async (req, res) => {
  try {
    console.log("File received:", req.file);
    console.log("Body received:", req.body);

    let videoData;

    if (req.file) {
      // File upload
      videoData = new Video({
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        classes: JSON.parse(req.body.classes),
        videoUrl: `/uploads/videos/${req.file.filename}`, // file path
        assignment: req.body.assignment,
        assignmentAnswer: req.body.assignmentAnswer,
      });
    } else {
      // URL upload
      videoData = new Video({
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        classes: JSON.parse(req.body.classes),
        videoUrl: req.body.videoUrl,
      });
    }

    await videoData.save();
    res.json(videoData);
  } catch (err) {
    console.error("Upload error:", err.message, err.stack);
    res.status(500).json({ error: "Video upload failed", details: err.message });
  }
});

// GET: Fetch all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error("Fetch error:", err.message, err.stack);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// POST: Submit an assignment for a video
router.post("/:videoId/submit", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { studentId, answer } = req.body; // Assuming studentId is sent in the body

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Basic scoring
    const score = video.assignmentAnswer === answer ? 1 : 0;

    const submission = {
      student: studentId,
      answer,
      score,
    };

    video.submissions.push(submission);
    await video.save();

    res.json({ message: "Assignment submitted successfully", score });
  } catch (err) {
    console.error("Submission error:", err.message, err.stack);
    res.status(500).json({ error: "Failed to submit assignment" });
  }
});

// POST: Track video progress
router.post("/:videoId/progress", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { studentId, watchTime } = req.body;

    const videoWatch = await VideoWatch.findOneAndUpdate(
      { video: videoId, student: studentId },
      { watchTime, lastWatchedAt: Date.now() },
      { upsert: true, new: true } // Create if it doesn't exist
    );

    res.json({ message: "Progress updated", videoWatch });
  } catch (err) {
    console.error("Progress update error:", err.message, err.stack);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

export default router;
