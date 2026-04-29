import { Router } from "express";
import { body } from "express-validator";
import { protect, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Notification } from "../models/Notification.js";

export const notificationRoutes = Router();
notificationRoutes.use(protect);

notificationRoutes.get("/", async (req, res) => {
  const notifications = await Notification.find({
    $or: [{ recipients: req.user._id }, { recipients: { $size: 0 } }]
  }).sort({ createdAt: -1 });
  res.json(notifications);
});

notificationRoutes.post(
  "/",
  authorize("admin", "teacher"),
  [body("title").notEmpty(), body("message").notEmpty()],
  validate,
  async (req, res) => {
    const notification = await Notification.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(notification);
  }
);
