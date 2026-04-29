import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";

export const aiRoutes = Router();
aiRoutes.use(protect);

aiRoutes.post("/face/verify", authorize("teacher", "student"), async (req, res) => {
  res.json({
    matched: true,
    confidence: 0.94,
    provider: "face-api-compatible",
    message: "Connect OpenCV or Face API descriptor comparison here."
  });
});

aiRoutes.get("/attendance-prediction", async (req, res) => {
  res.json({
    riskLevel: "medium",
    predictedMonthEndAttendance: 72,
    recommendations: ["Attend the next 4 sessions", "Prioritize Data Structures lab"]
  });
});
