import React from "react";
import { CheckCircle2 } from "lucide-react";

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-sm items-center gap-3 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-soft dark:bg-white dark:text-slate-950">
      <CheckCircle2 size={18} className="text-emerald-400" />
      {message}
    </div>
  );
}
