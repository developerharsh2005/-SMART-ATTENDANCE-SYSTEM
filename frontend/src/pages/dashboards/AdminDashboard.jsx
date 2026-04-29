import React from "react";
import { Activity, AlertTriangle, BookOpen, GraduationCap, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { StatCard } from "../../components/ui/StatCard";
import { Toast } from "../../components/ui/Toast";
import { analytics, auditLogs, courses, students, teachers } from "../../data/mockData";
import { downloadCsv, downloadText } from "../../lib/downloads";

export default function AdminDashboard() {
  const [studentRows, setStudentRows] = useState(students);
  const [teacherRows, setTeacherRows] = useState(teachers);
  const [courseRows, setCourseRows] = useState(courses);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [toast, setToast] = useState("");

  const filteredStudents = useMemo(() => {
    const value = query.toLowerCase();
    return studentRows.filter((student) => [student.id, student.name, student.course, student.risk].join(" ").toLowerCase().includes(value));
  }, [query, studentRows]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function upsertStudent(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const student = {
      id: form.get("id"),
      name: form.get("name"),
      course: form.get("course"),
      attendance: Number(form.get("attendance")),
      risk: Number(form.get("attendance")) < 75 ? "High" : Number(form.get("attendance")) < 82 ? "Medium" : "Low"
    };
    setStudentRows((rows) => (editingStudent ? rows.map((row) => (row.id === editingStudent.id ? student : row)) : [student, ...rows]));
    setEditingStudent(null);
    setModal(null);
    notify(editingStudent ? "Student record updated" : "Student added");
  }

  function deleteStudent(id) {
    setStudentRows((rows) => rows.filter((row) => row.id !== id));
    notify("Student removed from active list");
  }

  function addTeacher(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setTeacherRows((rows) => [
      { id: form.get("id"), name: form.get("name"), department: form.get("department"), subjects: form.get("subjects") },
      ...rows
    ]);
    setModal(null);
    notify("Teacher profile created");
  }

  function addCourse(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setCourseRows((rows) => [
      { id: form.get("id"), name: form.get("name"), department: form.get("department"), semester: form.get("semester"), teacher: form.get("teacher") },
      ...rows
    ]);
    setModal(null);
    notify("Course created and ready for subject assignment");
  }

  function exportReport() {
    downloadCsv("university-attendance-report.csv", studentRows);
    notify("CSV report downloaded");
  }

  function exportAudit() {
    downloadText("audit-log.txt", auditLogs.map((log) => `${log.time} - ${log.actor}: ${log.action}`).join("\n"));
    notify("Audit log downloaded");
  }

  return (
    <DashboardLayout>
      <Toast message={toast} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-campus">Admin Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">Campus attendance command center</h1>
        </div>
        <button className="btn-primary" onClick={exportReport}>Generate Monthly Report</button>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Students" value={studentRows.length} change={`${studentRows.filter((row) => row.attendance >= 75).length} above minimum`} icon={GraduationCap} tone="teal" />
        <StatCard title="Teachers" value={teacherRows.length} change="Faculty profiles managed" icon={Users} tone="blue" />
        <StatCard title="Courses" value={courseRows.length} change="Course catalog active" icon={BookOpen} tone="amber" />
        <StatCard title="At-risk students" value={studentRows.filter((row) => row.attendance < 75).length} change="Below 75% attendance" icon={AlertTriangle} tone="rose" />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Monthly analytics</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#0f766e" strokeWidth={3} />
                <Line type="monotone" dataKey="prediction" stroke="#f59e0b" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">System activity</h2>
          <div className="mt-4 space-y-3">
            {auditLogs.map((log) => (
              <div key={log.action} className="flex gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-800">
                <Activity className="mt-0.5 text-campus" size={18} />
                <div>
                  <p className="text-sm font-semibold">{log.action}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{log.actor} · {log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="people" className="mt-6 panel">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Manage students</h2>
          <div className="flex gap-2">
            <input className="input max-w-56" placeholder="Search students" value={query} onChange={(event) => setQuery(event.target.value)} />
            <button className="btn-secondary" onClick={() => { setEditingStudent(null); setModal("student"); }}>Add Student</button>
          </div>
        </div>
        <DataTable
          rows={filteredStudents}
          columns={[
            { key: "id", label: "Student ID" },
            { key: "name", label: "Name" },
            { key: "course", label: "Course" },
            { key: "attendance", label: "Attendance", render: (row) => `${row.attendance}%` },
            { key: "risk", label: "Risk" },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex gap-3">
                  <button className="font-semibold text-campus" onClick={() => { setEditingStudent(row); setModal("student"); }}>Edit</button>
                  <button className="font-semibold text-rose-600" onClick={() => deleteStudent(row.id)}>Delete</button>
                </div>
              )
            }
          ]}
        />
      </section>

      <section id="courses" className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="panel">
          <h2 className="font-bold text-slate-950 dark:text-white">Create Courses</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Configure programs, departments, semesters, and reporting rules.</p>
          <button className="btn-secondary mt-4" onClick={() => setModal("course")}>Create Course</button>
        </div>
        <div className="panel">
          <h2 className="font-bold text-slate-950 dark:text-white">Assign Teachers</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Create faculty profiles and map them to subject codes.</p>
          <button className="btn-secondary mt-4" onClick={() => setModal("teacher")}>Add Teacher</button>
        </div>
        <div className="panel">
          <h2 className="font-bold text-slate-950 dark:text-white">ERP Integration</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Prepare a clean export for your university ERP import workflow.</p>
          <button className="btn-secondary mt-4" onClick={() => { downloadCsv("erp-course-sync.csv", courseRows); notify("ERP sync file downloaded"); }}>Export ERP CSV</button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="panel">
          <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">Teachers</h2>
          <DataTable rows={teacherRows} columns={[
            { key: "id", label: "Employee ID" },
            { key: "name", label: "Name" },
            { key: "department", label: "Department" },
            { key: "subjects", label: "Subjects" }
          ]} />
        </div>
        <div className="panel">
          <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">Courses</h2>
          <DataTable rows={courseRows} columns={[
            { key: "id", label: "Code" },
            { key: "name", label: "Course" },
            { key: "semester", label: "Sem" },
            { key: "teacher", label: "Lead Teacher" }
          ]} />
        </div>
      </section>

      <section id="reports" className="mt-6 panel">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Attendance distribution</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <BarChart data={students}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button className="btn-secondary mt-4" onClick={exportAudit}>Download Audit Log</button>
      </section>

      <Modal open={modal === "student"} title={editingStudent ? "Edit Student" : "Add Student"} onClose={() => setModal(null)}>
        <form onSubmit={upsertStudent} className="grid gap-4 sm:grid-cols-2">
          <input className="input" name="id" placeholder="Student ID" defaultValue={editingStudent?.id} required />
          <input className="input" name="name" placeholder="Full name" defaultValue={editingStudent?.name} required />
          <input className="input sm:col-span-2" name="course" placeholder="Course" defaultValue={editingStudent?.course || "B.Tech CSE"} required />
          <input className="input" name="attendance" type="number" min="0" max="100" placeholder="Attendance %" defaultValue={editingStudent?.attendance || 75} required />
          <button className="btn-primary sm:col-span-2" type="submit">{editingStudent ? "Save Changes" : "Add Student"}</button>
        </form>
      </Modal>

      <Modal open={modal === "teacher"} title="Add Teacher" onClose={() => setModal(null)}>
        <form onSubmit={addTeacher} className="grid gap-4 sm:grid-cols-2">
          <input className="input" name="id" placeholder="Employee ID" required />
          <input className="input" name="name" placeholder="Full name" required />
          <input className="input" name="department" placeholder="Department" required />
          <input className="input" name="subjects" placeholder="Subject codes" required />
          <button className="btn-primary sm:col-span-2" type="submit">Create Teacher</button>
        </form>
      </Modal>

      <Modal open={modal === "course"} title="Create Course" onClose={() => setModal(null)}>
        <form onSubmit={addCourse} className="grid gap-4 sm:grid-cols-2">
          <input className="input" name="id" placeholder="Course code" required />
          <input className="input" name="name" placeholder="Course name" required />
          <input className="input" name="department" placeholder="Department" required />
          <input className="input" name="semester" placeholder="Semester" required />
          <select className="input sm:col-span-2" name="teacher" required>
            {teacherRows.map((teacher) => <option key={teacher.id}>{teacher.name}</option>)}
          </select>
          <button className="btn-primary sm:col-span-2" type="submit">Create Course</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
