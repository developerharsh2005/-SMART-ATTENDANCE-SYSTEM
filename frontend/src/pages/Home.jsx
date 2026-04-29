import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BellRing, CheckCircle2, Fingerprint, QrCode, ShieldCheck } from "lucide-react";
import { PublicLayout } from "../components/layout/PublicLayout";

const features = [
  { icon: QrCode, title: "QR attendance", text: "Fast session codes with duplicate prevention and timestamp capture." },
  { icon: Fingerprint, title: "Face API ready", text: "Pluggable OpenCV or Face API verification for smarter classrooms." },
  { icon: BarChart3, title: "Live analytics", text: "Subject, class, monthly, and risk reports for every role." },
  { icon: BellRing, title: "Alerts", text: "Real-time notifications and low-attendance email workflows." }
];

export default function Home() {
  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img className="h-full w-full object-cover opacity-35" src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=80" alt="University campus" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-teal-950/40" />
        </div>
        <div className="relative mx-auto grid min-h-[72vh] max-w-7xl content-center gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">University attendance platform</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">Smart Attendance System</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">A secure dashboard-based system for admins, teachers, and students to manage attendance, QR sessions, reports, alerts, and academic compliance from one responsive portal.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" to="/login">Open Dashboard <ArrowRight size={18} /></Link>
              <Link className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20" to="/register">Create Account</Link>
            </div>
          </div>
          <div className="panel hidden self-end bg-white/95 text-slate-950 dark:bg-slate-900/95 dark:text-white lg:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Today attendance</p>
                <p className="text-4xl font-bold">86.4%</p>
              </div>
              <ShieldCheck className="text-campus" size={42} />
            </div>
            <div className="mt-6 space-y-3">
              {["CS601 QR session verified", "12 low-attendance alerts queued", "Monthly report ready"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                  <CheckCircle2 className="text-campus" size={18} /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="panel">
              <Icon className="text-campus" size={28} />
              <h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
