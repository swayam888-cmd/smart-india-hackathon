import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // plain text
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  schoolName: { type: String, required: true },
  state: { type: String, required: true },
  subjects: [{ type: String }],
  classes: [{ type: String }],
  preferredLanguages: [{ type: String }],
  profilePicture: { type: String },
}, { timestamps: true });

// No hashing, passwords stored as plain text

// Optional: simple method to check password
teacherSchema.methods.matchPassword = function(enteredPassword) {
  return this.password === enteredPassword;
};

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
