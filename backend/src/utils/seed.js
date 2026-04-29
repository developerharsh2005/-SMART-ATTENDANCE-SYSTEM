import "dotenv/config";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Attendance } from "../models/Attendance.js";
import { Notification } from "../models/Notification.js";

await connectDB();
await Promise.all([User.deleteMany({}), Course.deleteMany({}), Attendance.deleteMany({}), Notification.deleteMany({})]);

const [admin, teacher, student, studentTwo] = await User.create([
  { name: "Dr. Anika Rao", email: "admin@university.edu", password: "Password123!", role: "admin", department: "Academic Affairs", employeeId: "ADM-001" },
  { name: "Prof. Kabir Mehta", email: "teacher@university.edu", password: "Password123!", role: "teacher", department: "Computer Science", employeeId: "CSE-014" },
  { name: "Maya Iyer", email: "student@university.edu", password: "Password123!", role: "student", department: "Computer Science", studentId: "22CSE118", year: "III" },
  { name: "Aarav Singh", email: "aarav@university.edu", password: "Password123!", role: "student", department: "Computer Science", studentId: "22CSE121", year: "III" }
]);

const course = await Course.create({
  name: "B.Tech Computer Science",
  code: "BTECH-CSE",
  department: "Computer Science",
  semester: "6",
  students: [student._id, studentTwo._id],
  subjects: [
    { code: "CS601", name: "Distributed Systems", teacher: teacher._id, minimumAttendance: 75 },
    { code: "CS602", name: "AI and Machine Learning", teacher: teacher._id, minimumAttendance: 75 }
  ]
});

await Attendance.create([
  { student: student._id, teacher: teacher._id, course: course._id, subjectCode: "CS601", status: "present", method: "qr", sessionKey: "CS601-2026-04-01" },
  { student: student._id, teacher: teacher._id, course: course._id, subjectCode: "CS602", status: "late", method: "face", sessionKey: "CS602-2026-04-02" },
  { student: studentTwo._id, teacher: teacher._id, course: course._id, subjectCode: "CS601", status: "absent", method: "manual", sessionKey: "CS601-2026-04-01" }
]);

await Notification.create({
  title: "Low attendance warning",
  message: "Students below 75% attendance should meet their faculty advisor this week.",
  type: "warning",
  createdBy: admin._id,
  recipients: [student._id]
});

console.log("Seed data created");
process.exit(0);
