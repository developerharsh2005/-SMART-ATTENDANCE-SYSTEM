import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { PublicLayout } from "../components/layout/PublicLayout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@university.edu", password: "Password123!", role: "admin" });
  const samples = {
    admin: "admin@university.edu",
    teacher: "teacher@university.edu",
    student: "student@university.edu"
  };

  async function submit(event) {
    event.preventDefault();
    const user = await login(form);
    navigate(`/${user.role}`);
  }

  return (
    <PublicLayout>
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="self-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-campus">Secure login</p>
          <h1 className="mt-4 text-4xl font-extrabold text-slate-950 dark:text-white">Continue to your attendance workspace.</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Choose a role to preview role-based redirection. If the backend is running, credentials are validated through the JWT API.</p>
        </section>
        <form onSubmit={submit} className="panel space-y-4">
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value, email: samples[e.target.value] })}>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
          <input className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Password" />
          <button className="btn-primary w-full" type="submit"><LogIn size={18} /> Login</button>
          <div className="flex justify-between text-sm">
            <Link className="font-semibold text-campus" to="/forgot-password">Forgot password?</Link>
            <Link className="font-semibold text-campus" to="/register">Create account</Link>
          </div>
        </form>
      </main>
    </PublicLayout>
  );
}
