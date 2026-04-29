import React from "react";
import clsx from "clsx";

export function StatCard({ title, value, change, icon: Icon, tone = "teal" }) {
  const tones = {
    teal: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
  };

  return (
    <div className="panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={clsx("rounded-md p-3", tones[tone])}>{Icon && <Icon size={22} />}</div>
      </div>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{change}</p>
    </div>
  );
}
