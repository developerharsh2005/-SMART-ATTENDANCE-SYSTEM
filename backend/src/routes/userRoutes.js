import { Router } from "express";
import { body } from "express-validator";
import { protect, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { User } from "../models/User.js";
import { writeAudit } from "../utils/audit.js";

export const userRoutes = Router();
userRoutes.use(protect);

userRoutes.get("/", authorize("admin", "teacher"), async (req, res) => {
  const { role, search = "" } = req.query;
  const filter = {
    ...(role ? { role } : {}),
    ...(search ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] } : {})
  };
  res.json(await User.find(filter).select("-password").sort({ createdAt: -1 }));
});

userRoutes.post(
  "/",
  authorize("admin"),
  [body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 8 }), body("role").isIn(["admin", "teacher", "student"])],
  validate,
  async (req, res) => {
    const user = await User.create(req.body);
    await writeAudit(req, "CREATE_USER", "User", user._id, { role: user.role });
    res.status(201).json(user);
  }
);

userRoutes.put("/:id", authorize("admin"), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  await writeAudit(req, "UPDATE_USER", "User", user._id);
  res.json(user);
});

userRoutes.delete("/:id", authorize("admin"), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  await writeAudit(req, "DEACTIVATE_USER", "User", user._id);
  res.json({ message: "User deactivated" });
});
