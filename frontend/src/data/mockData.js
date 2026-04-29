export const analytics = [
  { month: "Jan", attendance: 82, prediction: 84 },
  { month: "Feb", attendance: 78, prediction: 80 },
  { month: "Mar", attendance: 86, prediction: 85 },
  { month: "Apr", attendance: 74, prediction: 77 },
  { month: "May", attendance: 88, prediction: 87 }
];

export const subjectAttendance = [
  { subject: "Distributed Systems", code: "CS601", percent: 82, attended: 41, total: 50 },
  { subject: "AI and Machine Learning", code: "CS602", percent: 68, attended: 34, total: 50 },
  { subject: "Cloud Computing", code: "CS603", percent: 91, attended: 46, total: 50 },
  { subject: "Software Testing", code: "CS604", percent: 76, attended: 38, total: 50 }
];

export const students = [
  { id: "22CSE118", name: "Maya Iyer", course: "B.Tech CSE", attendance: 79, risk: "Medium" },
  { id: "22CSE121", name: "Aarav Singh", course: "B.Tech CSE", attendance: 71, risk: "High" },
  { id: "22CSE130", name: "Nisha Verma", course: "B.Tech CSE", attendance: 92, risk: "Low" },
  { id: "22CSE144", name: "Rohan Shah", course: "B.Tech CSE", attendance: 84, risk: "Low" }
];

export const teachers = [
  { id: "CSE-014", name: "Prof. Kabir Mehta", department: "Computer Science", subjects: "CS601, CS602" },
  { id: "ECE-022", name: "Dr. Sara Khan", department: "Electronics", subjects: "EC501" },
  { id: "MTH-008", name: "Dr. Vivek Menon", department: "Mathematics", subjects: "MA401" }
];

export const courses = [
  { id: "BTECH-CSE", name: "B.Tech Computer Science", department: "Computer Science", semester: "6", teacher: "Prof. Kabir Mehta" },
  { id: "BTECH-ECE", name: "B.Tech Electronics", department: "Electronics", semester: "4", teacher: "Dr. Sara Khan" },
  { id: "BCA-AI", name: "BCA Artificial Intelligence", department: "Computer Applications", semester: "2", teacher: "Dr. Vivek Menon" }
];

export const auditLogs = [
  { actor: "Dr. Anika Rao", action: "Created CS602 subject", time: "10:20 AM" },
  { actor: "Prof. Kabir Mehta", action: "Edited CS601 attendance", time: "09:45 AM" },
  { actor: "System", action: "Sent low-attendance emails", time: "08:30 AM" }
];
