import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, BookOpen, CalendarDays, Download, Home, LogOut, Menu, Moon, QrCode, Search, Shield, Sun, Users } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const links = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: Home },
    { to: "/admin#people", label: "People", icon: Users },
    { to: "/admin#courses", label: "Courses", icon: BookOpen },
    { to: "/admin#reports", label: "Reports", icon: Download },
    { to: "/admin#audit", label: "Audit Logs", icon: Shield }
  ],
  teacher: [
    { to: "/teacher", label: "Dashboard", icon: Home },
    { to: "/teacher#take", label: "Take Attendance", icon: QrCode },
    { to: "/teacher#calendar", label: "Calendar", icon: CalendarDays },
    { to: "/teacher#reports", label: "Reports", icon: Download }
  ],
  student: [
    { to: "/student", label: "Dashboard", icon: Home },
    { to: "/student#subjects", label: "Subjects", icon: BookOpen },
    { to: "/student#calendar", label: "Calendar", icon: CalendarDays },
    { to: "/student#reports", label: "Reports", icon: Download }
  ]
};

export function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const navLinks = links[user?.role || "student"];

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <aside className={clsx("fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-4 transition dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="rounded-md bg-campus p-2 text-white"><Shield size={22} /></div>
          <div>
            <p className="font-bold">University Portal</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Smart Attendance</p>
          </div>
        </div>
        <nav className="mt-6 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={label} to={to} onClick={() => setOpen(false)} className={({ isActive }) => clsx("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold", isActive ? "bg-teal-50 text-campus dark:bg-teal-950 dark:text-teal-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800")}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" />}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <button className="btn-secondary h-10 w-10 px-0 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={18} /></button>
            <div className="hidden max-w-md flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 md:flex">
              <Search size={17} /> Search students, subjects, reports
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="btn-secondary h-10 w-10 px-0" aria-label="Notifications"><Bell size={18} /></button>
              <button className="btn-secondary h-10 w-10 px-0" onClick={toggleTheme} aria-label="Toggle theme">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user?.name || "Demo User"}</p>
                <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{user?.role || "student"}</p>
              </div>
              <button className="btn-secondary h-10 w-10 px-0" onClick={handleLogout} aria-label="Logout"><LogOut size={18} /></button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
