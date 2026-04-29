import React from "react";
import { AlertTriangle, CalendarDays, Download, TrendingUp, UserCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { StatCard } from "../../components/ui/StatCard";
import { Toast } from "../../components/ui/Toast";
import { subjectAttendance } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";
import { downloadCsv, downloadText } from "../../lib/downloads";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState(subjectAttendance);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const low = subjects.filter((item) => item.percent < 75);
  const overall = Math.round(subjects.reduce((sum, item) => sum + item.percent, 0) / subjects.length);
  const filteredSubjects = useMemo(() => {
    const value = query.toLowerCase();
    return subjects.filter((item) => [item.subject, item.code].join(" ").toLowerCase().includes(value));
  }, [query, subjects]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function downloadReport() {
    downloadCsv("my-attendance-report.csv", subjects);
    notify("Personal attendance report downloaded");
  }

  function acknowledgeAlerts() {
    setSubjects((rows) => rows.map((row) => row.percent < 75 ? { ...row, percent: row.percent, acknowledged: true } : row));
    notify("Low-attendance alerts acknowledged");
  }

  function saveProfile(event) {
    event.preventDefault();
    setModal(null);
    notify("Profile changes saved locally");
  }

  return (
    <DashboardLayout>
      <Toast message={toast} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-campus">Student Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">Welcome back, {user?.name || "Student"}</h1>
        </div>
        <button className="btn-primary" onClick={downloadReport}><Download size={18} /> Download Report</button>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Overall attendance" value={`${overall}%`} change={`${overall - 75}% above university minimum`} icon={TrendingUp} tone="teal" />
        <StatCard title="Low subjects" value={low.length} change="Needs attention this week" icon={AlertTriangle} tone="rose" />
        <StatCard title="Classes attended" value={subjects.reduce((sum, item) => sum + item.attended, 0)} change={`Out of ${subjects.reduce((sum, item) => sum + item.total, 0)} sessions`} icon={CalendarDays} tone="blue" />
        <StatCard title="Profile status" value="Verified" change="Face descriptor enrolled" icon={UserCircle} tone="amber" />
      </section>

      <section id="subjects" className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="panel">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Subject-wise attendance</h2>
            <input className="input max-w-52" placeholder="Filter subjects" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <DataTable
            rows={filteredSubjects}
            columns={[
              { key: "code", label: "Code" },
              { key: "subject", label: "Subject" },
              { key: "attended", label: "Attended" },
              { key: "total", label: "Total" },
              { key: "percent", label: "Percent", render: (row) => <span className={row.percent < 75 ? "font-bold text-rose-600" : "font-bold text-campus"}>{row.percent}%</span> },
              { key: "acknowledged", label: "Alert", render: (row) => row.percent < 75 ? (row.acknowledged ? "Acknowledged" : "Pending") : "Clear" }
            ]}
          />
        </div>
        <div className="panel">
          <h2 className="text-lg font-bold">Attendance tracker</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={[{ name: "Attended", value: 159 }, { name: "Missed", value: 41 }]} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={4}>
                  <Cell fill="#0f766e" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
            AI prediction: attending the next 4 sessions should raise CS602 above 75%.
          </div>
        </div>
      </section>

      <section id="calendar" className="mt-6 panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold">Attendance calendar</h2>
          <button className="btn-secondary" onClick={() => { downloadText("attendance-calendar.ics", "BEGIN:VCALENDAR\nVERSION:2.0\nSUMMARY:Smart Attendance Calendar\nEND:VCALENDAR"); notify("Calendar file downloaded"); }}>Export Calendar</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 14 }, (_, index) => (
            <div key={index} className="min-h-24 rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <p className="text-sm font-semibold">Apr {index + 15}</p>
              <p className={index % 4 === 0 ? "mt-4 text-xs text-rose-600" : "mt-4 text-xs text-campus"}>{index % 4 === 0 ? "Absent" : "Present"}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="panel">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Alerts</h2>
            <button className="btn-secondary" onClick={acknowledgeAlerts}>Acknowledge</button>
          </div>
          <div className="mt-4 space-y-3">
            {low.map((item) => (
              <div key={item.code} className="rounded-md bg-rose-50 p-4 text-sm text-rose-900 dark:bg-rose-950 dark:text-rose-100">
                {item.subject} is at {item.percent}%. Attend upcoming sessions to avoid detention risk.
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Profile</h2>
            <button className="btn-secondary" onClick={() => setModal("profile")}>Edit</button>
          </div>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Department</dt><dd>{user?.department || "Computer Science"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Student ID</dt><dd>22CSE118</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">ERP Sync</dt><dd className="font-semibold text-campus">Connected</dd></div>
          </dl>
        </div>
      </section>

      <Modal open={modal === "profile"} title="Edit Profile" onClose={() => setModal(null)}>
        <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
          <input className="input" defaultValue={user?.name || "Maya Iyer"} />
          <input className="input" defaultValue={user?.email || "student@university.edu"} />
          <input className="input" defaultValue={user?.department || "Computer Science"} />
          <input className="input" defaultValue="22CSE118" />
          <button className="btn-primary sm:col-span-2" type="submit">Save Profile</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
