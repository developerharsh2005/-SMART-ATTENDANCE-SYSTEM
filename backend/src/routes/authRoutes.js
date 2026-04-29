import crypto from "crypto";
import { Router } from "express";
import { body } from "express-validator";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { validate } from "../middleware/validate.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("role").isIn(["admin", "teacher", "student"])
  ],
  validate,
  async (req, res) => {
    const exists = await User.exists({ email: req.body.email });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const user = await User.create(req.body);
    res.status(201).json({ token: signToken(user), user: sanitizeUser(user) });
  }
);

authRoutes.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  validate,
  async (req, res) => {
    const user = await User.findOne({ email: req.body.email }).select("+password");
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: signToken(user), user: sanitizeUser(user) });
  }
);

authRoutes.post("/forgot-password", [body("email").isEmail().normalizeEmail()], validate, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30);
    await user.save();
  }
  res.json({ message: "If an account exists, reset instructions have been sent." });
});

authRoutes.post(
  "/reset-password",
  [body("token").notEmpty(), body("password").isLength({ min: 8 })],
  validate,
  async (req, res) => {
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  }
);

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    studentId: user.studentId,
    employeeId: user.employeeId
  };
}
