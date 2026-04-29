import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import { Attendance } from "../models/Attendance.js";

export const reportRoutes = Router();
reportRoutes.use(protect);

reportRoutes.get("/summary", authorize("admin", "teacher", "student"), async (req, res) => {
  const match = {};
  if (req.user.role === "student") match.student = req.user._id;
  if (req.user.role === "teacher") match.teacher = req.user._id;

  const summary = await Attendance.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$subjectCode",
        total: { $sum: 1 },
        present: { $sum: { $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] } }
      }
    },
    { $project: { subjectCode: "$_id", total: 1, present: 1, percentage: { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1] } } }
  ]);

  res.json(summary);
});

reportRoutes.get("/export.csv", authorize("admin", "teacher", "student"), async (req, res) => {
  const rows = await Attendance.find().populate("student", "name email").populate("course", "name code").lean();
  const csv = ["Student,Email,Course,Subject,Status,Method,Timestamp"]
    .concat(rows.map((r) => `${r.student?.name || ""},${r.student?.email || ""},${r.course?.code || ""},${r.subjectCode},${r.status},${r.method},${r.timestamp.toISOString()}`))
    .join("\n");
  res.header("Content-Type", "text/csv");
  res.attachment("attendance-report.csv");
  res.send(csv);
});
