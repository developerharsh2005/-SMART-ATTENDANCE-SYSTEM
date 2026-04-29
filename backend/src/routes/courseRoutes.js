import { Router } from "express";
import { body } from "express-validator";
import { protect, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Course } from "../models/Course.js";
import { writeAudit } from "../utils/audit.js";

export const courseRoutes = Router();
courseRoutes.use(protect);

courseRoutes.get("/", async (req, res) => {
  const courses = await Course.find().populate("subjects.teacher", "name email").populate("students", "name email studentId");
  res.json(courses);
});

courseRoutes.post(
  "/",
  authorize("admin"),
  [body("name").notEmpty(), body("code").notEmpty(), body("department").notEmpty()],
  validate,
  async (req, res) => {
    const course = await Course.create(req.body);
    await writeAudit(req, "CREATE_COURSE", "Course", course._id);
    res.status(201).json(course);
  }
);

courseRoutes.put("/:id", authorize("admin"), async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!course) return res.status(404).json({ message: "Course not found" });
  await writeAudit(req, "UPDATE_COURSE", "Course", course._id);
  res.json(course);
});
