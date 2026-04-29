import React from "react";
import { PublicLayout } from "../components/layout/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-campus">About the system</p>
        <h1 className="mt-4 text-4xl font-extrabold text-slate-950 dark:text-white">Built for academic operations at scale.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">The Smart Attendance System brings student records, faculty workflows, QR attendance, face-recognition readiness, reports, and auditability into a single university-grade product. It is designed around role-specific dashboards so each user gets the right tools immediately after login.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {["JWT-secured APIs", "Role-based access", "MongoDB audit trail"].map((item) => (
            <div className="panel" key={item}>
              <h2 className="font-bold text-slate-950 dark:text-white">{item}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Production-oriented defaults with clean extension points for ERP, email, and biometric providers.</p>
            </div>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}
