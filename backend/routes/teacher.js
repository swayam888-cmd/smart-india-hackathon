import express from "express";
import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

const router = express.Router();

// JWT generator
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route POST /api/auth/teacher/register
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      fullName,
      schoolName,
      state,
      mobileNumber,
      subjects,
      classes,
      preferredLanguages,
      profilePicture,
    } = req.body;

    // Check if username exists in either collection
    const [existingTeacher, existingStudent] = await Promise.all([
      Teacher.findOne({ username }),
      Student.findOne({ username }),
    ]);

    if (existingTeacher || existingStudent) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if mobile number exists in either collection
    if (mobileNumber) {
      const [mobileTeacher, mobileStudent] = await Promise.all([
        Teacher.findOne({ mobileNumber }),
        Student.findOne({ mobileNumber }),
      ]);

      if (mobileTeacher || mobileStudent) {
        return res.status(400).json({ message: "Mobile number already exists" });
      }
    }

    // Create teacher
    const teacher = await Teacher.create({
      username,
      password, // stored in plain text
      fullName,
      schoolName,
      state,
      mobileNumber,
      subjects,
      classes,
      preferredLanguages,
      profilePicture,
    });

    const token = generateToken(teacher._id);
    res.status(201).json({ token, user: teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/teacher/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find teacher by username
    const teacher = await Teacher.findOne({ username });
    if (!teacher || !teacher.matchPassword(password)) { // plain-text check
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(teacher._id);
    res.json({ token, user: teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
