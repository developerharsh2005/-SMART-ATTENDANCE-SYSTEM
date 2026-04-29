import { Router } from "express";
import { body } from "express-validator";
import QRCode from "qrcode";
import { nanoid } from "nanoid";
import { protect, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Attendance } from "../models/Attendance.js";
import { writeAudit } from "../utils/audit.js";

export const attendanceRoutes = Router();
attendanceRoutes.use(protect);

attendanceRoutes.post("/session/qr", authorize("teacher"), async (req, res) => {
  const sessionKey = `ATT-${nanoid(10)}`;
  const qrCode = await QRCode.toDataURL(JSON.stringify({ sessionKey, expiresAt: Date.now() + 10 * 60 * 1000 }));
  res.json({ sessionKey, qrCode });
});

attendanceRoutes.post(
  "/mark",
  [
    body("student").notEmpty(),
    body("course").notEmpty(),
    body("subjectCode").notEmpty(),
    body("sessionKey").notEmpty(),
    body("status").optional().isIn(["present", "absent", "late", "excused"]),
    body("method").optional().isIn(["manual", "qr", "face"])
  ],
  validate,
  async (req, res) => {
    const teacher = req.user.role === "teacher" ? req.user._id : req.body.teacher;
    try {
      const attendance = await Attendance.create({ ...req.body, teacher });
      await writeAudit(req, "MARK_ATTENDANCE", "Attendance", attendance._id, { method: attendance.method });
      res.status(201).json(attendance);
    } catch (error) {
      if (error.code === 11000) return res.status(409).json({ message: "Attendance already marked for this session" });
      throw error;
    }
  }
);

attendanceRoutes.get("/", async (req, res) => {
  const filter = {};
  if (req.user.role === "student") filter.student = req.user._id;
  if (req.user.role === "teacher") filter.teacher = req.user._id;
  if (req.query.subjectCode) filter.subjectCode = req.query.subjectCode;
  const records = await Attendance.find(filter)
    .populate("student", "name email studentId")
    .populate("teacher", "name email")
    .populate("course", "name code")
    .sort({ timestamp: -1 });
  res.json(records);
});

attendanceRoutes.patch("/:id", authorize("admin", "teacher"), async (req, res) => {
  const record = await Attendance.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, editReason: req.body.editReason, editedBy: req.user._id },
    { new: true }
  );
  if (!record) return res.status(404).json({ message: "Attendance record not found" });
  await writeAudit(req, "EDIT_ATTENDANCE", "Attendance", record._id, { status: record.status });
  res.json(record);
});
