import React from "react";
import { BellRing, CalendarDays, CheckCircle2, Download, QrCode, ScanFace, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { StatCard } from "../../components/ui/StatCard";
import { Toast } from "../../components/ui/Toast";
import { students, subjectAttendance } from "../../data/mockData";
import { downloadCsv } from "../../lib/downloads";

export default function TeacherDashboard() {
  const [records, setRecords] = useState(students.map((student) => ({ ...student, status: "present", subject: "CS601", method: "manual" })));
  const [modal, setModal] = useState(null);
  const [sessionKey, setSessionKey] = useState("");
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("");

  const filteredRecords = useMemo(() => {
    const value = filter.toLowerCase();
    return records.filter((record) => [record.id, record.name, record.status, record.subject].join(" ").toLowerCase().includes(value));
  }, [filter, records]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function generateQr() {
    const key = `CS601-${Date.now().toString().slice(-6)}`;
    setSessionKey(key);
    setModal("qr");
    notify("QR session generated");
  }

  function markManual(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setRecords((rows) => rows.map((row) => row.id === form.get("student") ? { ...row, status: form.get("status"), subject: form.get("subject"), method: "manual" } : row));
    setModal(null);
    notify("Attendance record updated");
  }

  function verifyFace() {
    setRecords((rows) => rows.map((row, index) => index === 0 ? { ...row, status: "present", method: "face" } : row));
    setModal(null);
    notify("Face verification matched Maya Iyer at 94% confidence");
  }

  function sendNotification(event) {
    event.preventDefault();
    setModal(null);
    notify("Notification queued for selected students");
  }

  function exportRecords() {
    downloadCsv("class-attendance-records.csv", records);
    notify("Class attendance CSV downloaded");
  }

  return (
    <DashboardLayout>
      <Toast message={toast} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-campus">Teacher Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">Today’s classes and attendance tools</h1>
        </div>
        <button className="btn-primary" onClick={() => setModal("notify")}><BellRing size={18} /> Notify Students</button>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Classes today" value="4" change="2 labs and 2 lectures" icon={CalendarDays} tone="blue" />
        <StatCard title="Marked" value={records.filter((record) => record.status !== "absent").length} change="Current roster records" icon={CheckCircle2} tone="teal" />
        <StatCard title="Pending" value={records.filter((record) => record.status === "absent").length} change="Needs follow-up" icon={Users} tone="amber" />
        <StatCard title="Reports" value="12" change="Ready for download" icon={Download} tone="rose" />
      </section>

      <section id="take" className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="panel">
          <QrCode className="text-campus" size={30} />
          <h2 className="mt-4 text-lg font-bold">QR Code attendance</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Generate a timed QR session key for students in the classroom.</p>
          <button className="btn-primary mt-5 w-full" onClick={generateQr}>Generate QR</button>
        </div>
        <div className="panel">
          <ScanFace className="text-campus" size={30} />
          <h2 className="mt-4 text-lg font-bold">Face recognition</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Verify enrolled face descriptors through the optional API adapter.</p>
          <button className="btn-secondary mt-5 w-full" onClick={() => setModal("face")}>Start Scan</button>
        </div>
        <div className="panel">
          <Users className="text-campus" size={30} />
          <h2 className="mt-4 text-lg font-bold">Manual marking</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Mark present, absent, late, or excused with an audit reason.</p>
          <button className="btn-secondary mt-5 w-full" onClick={() => setModal("manual")}>Open Roster</button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel">
          <h2 className="text-lg font-bold">Class attendance</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={subjectAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="code" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percent" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Editable records</h2>
            <div className="flex gap-2">
              <input className="input max-w-48" placeholder="Search roster" value={filter} onChange={(event) => setFilter(event.target.value)} />
              <button className="btn-secondary" onClick={exportRecords}>Export CSV</button>
            </div>
          </div>
          <DataTable
            rows={filteredRecords}
            columns={[
              { key: "id", label: "ID" },
              { key: "name", label: "Student" },
              { key: "subject", label: "Subject" },
              { key: "status", label: "Status" },
              { key: "method", label: "Method" },
              { key: "attendance", label: "Attendance", render: (row) => `${row.attendance}%` },
              { key: "action", label: "Action", render: (row) => <button className="font-semibold text-campus" onClick={() => { setModal("manual"); window.localStorage.setItem("teacher_selected_student", row.id); }}>Edit</button> }
            ]}
          />
        </div>
      </section>

      <section id="calendar" className="mt-6 panel">
        <h2 className="text-lg font-bold">Calendar view</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 14 }, (_, index) => (
            <div key={index} className="min-h-24 rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <p className="text-sm font-semibold">Apr {index + 15}</p>
              <p className="mt-4 text-xs text-slate-500">{index % 3 === 0 ? "CS601 marked" : "No session"}</p>
            </div>
          ))}
        </div>
      </section>

      <Modal open={modal === "qr"} title="QR Attendance Session" onClose={() => setModal(null)}>
        <div className="text-center">
          <div className="mx-auto grid h-52 w-52 place-items-center rounded-lg border-4 border-slate-900 bg-white p-4 text-slate-950 dark:border-white">
            <QrCode size={140} />
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Session key</p>
          <p className="mt-1 text-2xl font-extrabold tracking-wider">{sessionKey}</p>
          <button className="btn-secondary mt-5" onClick={() => navigator.clipboard.writeText(sessionKey).then(() => notify("Session key copied"))}>Copy Key</button>
        </div>
      </Modal>

      <Modal open={modal === "manual"} title="Manual Attendance" onClose={() => setModal(null)}>
        <form onSubmit={markManual} className="grid gap-4 sm:grid-cols-2">
          <select className="input sm:col-span-2" name="student" defaultValue={window.localStorage.getItem("teacher_selected_student") || records[0]?.id}>
            {records.map((record) => <option value={record.id} key={record.id}>{record.name} ({record.id})</option>)}
          </select>
          <select className="input" name="subject" defaultValue="CS601">
            <option>CS601</option>
            <option>CS602</option>
            <option>CS603</option>
          </select>
          <select className="input" name="status" defaultValue="present">
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
          <textarea className="input sm:col-span-2" placeholder="Audit reason or note" />
          <button className="btn-primary sm:col-span-2" type="submit">Save Attendance</button>
        </form>
      </Modal>

      <Modal open={modal === "face"} title="Face Recognition Check" onClose={() => setModal(null)}>
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
          <ScanFace className="mx-auto text-campus" size={72} />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">This demo simulates a successful Face API match. Connect the backend `/api/ai/face/verify` route to a camera provider for live capture.</p>
          <button className="btn-primary mt-5" onClick={verifyFace}>Verify Student</button>
        </div>
      </Modal>

      <Modal open={modal === "notify"} title="Send Student Notification" onClose={() => setModal(null)}>
        <form onSubmit={sendNotification} className="space-y-4">
          <input className="input" defaultValue="Attendance reminder" />
          <textarea className="input min-h-32" defaultValue="Please attend the next class to stay above the university minimum attendance requirement." />
          <button className="btn-primary w-full" type="submit">Queue Notification</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
