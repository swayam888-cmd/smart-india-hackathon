import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
import { fileURLToPath } from "url";

import studentRoutes from "./routes/student.js";
import teacherRoutes from "./routes/teacher.js";
import videoRoutes from "./routes/video.js";
import chatRoutes from "./routes/chat.mjs"; // New chat route // ✅ added

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form data

app.use(cors({
  origin: 'http://localhost:8079',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(
  session({
    secret: "hello",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// Make flash messages available
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ✅ Serve uploaded videos/images/files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes


// Routes
app.use("/api/auth/student", studentRoutes);
app.use("/api/auth/teacher", teacherRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/chat", chatRoutes); // New chat route // ✅ added

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
