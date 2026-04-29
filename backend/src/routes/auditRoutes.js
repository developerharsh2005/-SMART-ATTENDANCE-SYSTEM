import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import { AuditLog } from "../models/AuditLog.js";

export const auditRoutes = Router();
auditRoutes.use(protect, authorize("admin"));

auditRoutes.get("/", async (req, res) => {
  res.json(await AuditLog.find().populate("actor", "name email role").sort({ createdAt: -1 }).limit(100));
});
