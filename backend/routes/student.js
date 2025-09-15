import express from "express";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Video from "../models/Video.js";
import VideoWatch from "../models/VideoWatch.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route POST /api/auth/student/register
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      fullName,
      schoolName,
      state,
      class: className,
      preferredLanguage,
      profilePicture,
      mobileNumber,
    } = req.body;

    // Validate required fields
    if (!username || !password || !fullName || !mobileNumber) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Check if username exists
    const [existingStudent, existingTeacher] = await Promise.all([
      Student.findOne({ username }),
      Teacher.findOne({ username }),
    ]);

    if (existingStudent || existingTeacher) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if mobile number exists
    const [mobileStudent, mobileTeacher] = await Promise.all([
      Student.findOne({ mobileNumber }),
      Teacher.findOne({ mobileNumber }),
    ]);

    if (mobileStudent || mobileTeacher) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }

    // Create student
    const student = await Student.create({
      username,
      password,
      fullName,
      schoolName,
      state,
      class: className,
      preferredLanguage,
      profilePicture,
      mobileNumber,
    });

    const token = generateToken(student._id);

    res.status(201).json({ token, user: student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/student/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = student.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(student._id);

    res.json({ token, user: student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/auth/student/all
router.get("/all", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/auth/student/:studentId/scores
router.get("/:studentId/scores", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find all videos with submissions from this student
    const videos = await Video.find({ "submissions.student": studentId });

    let totalScore = 0;
    let totalPossibleScore = 0;

    videos.forEach(video => {
      video.submissions.forEach(sub => {
        if (sub.student.toString() === studentId) {
          totalScore += sub.score;
          totalPossibleScore += 1; // Assuming each assignment is worth 1 point
        }
      });
    });

    const eligibilityPercentage = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;
    const isEligible = eligibilityPercentage >= 40;

    res.json({
      totalScore,
      totalPossibleScore,
      eligibilityPercentage,
      isEligible,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Placeholder functions for sending notifications
const sendEmail = (to, subject, body) => {
  console.log(`Sending email to ${to}: ${subject} - ${body}`);
  // In a real app, you would use a service like SendGrid or Nodemailer
  return Promise.resolve();
};

const sendSms = (to, body) => {
  console.log(`Sending SMS to ${to}: ${body}`);
  // In a real app, you would use a service like Twilio
  return Promise.resolve();
};

// @route POST /api/auth/student/check-inactivity
router.post("/check-inactivity", async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find students who HAVE been active recently
    const activeStudentIds = (await VideoWatch.find({ lastWatchedAt: { $gte: sevenDaysAgo } }).distinct("student"));

    // Find all students who are NOT in the active list
    const inactiveStudents = await Student.find({ _id: { $nin: activeStudentIds } });

    for (const student of inactiveStudents) {
      const message = `Dear Parent, this is a notification that your child, ${student.fullName}, has not completed their weekly video watching goals. Please encourage them to log in and continue their learning journey.`;

      if (student.parentEmail) {
        await sendEmail(student.parentEmail, "Student Inactivity Notification", message);
      }
      if (student.parentMobileNumber) {
        await sendSms(student.parentMobileNumber, message);
      }
    }

    res.json({ message: `Inactivity check complete. Notified ${inactiveStudents.length} parents.` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
