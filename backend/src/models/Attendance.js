import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    subjectCode: { type: String, required: true },
    status: { type: String, enum: ["present", "absent", "late", "excused"], default: "present" },
    method: { type: String, enum: ["manual", "qr", "face"], default: "manual" },
    sessionKey: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    location: {
      lat: Number,
      lng: Number,
      label: String
    },
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    editReason: String
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, sessionKey: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
