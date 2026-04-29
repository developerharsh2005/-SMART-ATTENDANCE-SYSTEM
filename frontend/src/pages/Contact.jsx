import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { PublicLayout } from "../components/layout/PublicLayout";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <PublicLayout>
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-campus">Contact</p>
          <h1 className="mt-4 text-4xl font-extrabold text-slate-950 dark:text-white">Bring smart attendance to your campus.</h1>
          <div className="mt-8 space-y-4 text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-3"><Mail size={18} /> registrar@university.edu</p>
            <p className="flex items-center gap-3"><Phone size={18} /> +91 98765 43210</p>
            <p className="flex items-center gap-3"><MapPin size={18} /> Academic Block, Main Campus</p>
          </div>
        </section>
        <form className="panel space-y-4" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
          <input className="input" placeholder="Name" required />
          <input className="input" placeholder="Email" type="email" required />
          <textarea className="input min-h-36" placeholder="Message" required />
          {sent && <p className="rounded-md bg-teal-50 p-3 text-sm font-semibold text-campus dark:bg-teal-950 dark:text-teal-200">Message saved. Connect this form to your university helpdesk email in production.</p>}
          <button className="btn-primary w-full" type="submit">Send Message</button>
        </form>
      </main>
    </PublicLayout>
  );
}
