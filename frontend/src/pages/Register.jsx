import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PublicLayout } from "../components/layout/PublicLayout";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", department: "Computer Science" });

  function submit(event) {
    event.preventDefault();
    const user = signup(form);
    navigate(`/${user.role}`);
  }

  return (
    <PublicLayout>
      <main className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
        <form onSubmit={submit} className="panel space-y-4">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Create account</h1>
          <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn-primary w-full" type="submit">Register</button>
        </form>
      </main>
    </PublicLayout>
  );
}
