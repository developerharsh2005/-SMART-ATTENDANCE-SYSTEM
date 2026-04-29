import React from "react";
import { useState } from "react";
import { PublicLayout } from "../components/layout/PublicLayout";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  return (
    <PublicLayout>
      <main className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
        <form className="panel space-y-4" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Reset password</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Enter your university email to receive reset instructions.</p>
          <input className="input" placeholder="Email address" type="email" required />
          {sent && <p className="rounded-md bg-teal-50 p-3 text-sm font-semibold text-campus dark:bg-teal-950 dark:text-teal-200">Reset instructions are ready to send through the backend email provider.</p>}
          <button className="btn-primary w-full" type="submit">Send Reset Link</button>
        </form>
      </main>
    </PublicLayout>
  );
}
