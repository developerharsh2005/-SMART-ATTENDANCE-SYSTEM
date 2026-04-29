import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, University } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function PublicLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-base font-bold">
            <span className="rounded-md bg-campus p-2 text-white"><University size={20} /></span>
            Smart Attendance
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <button className="btn-secondary h-10 w-10 px-0" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="btn-primary">Login</Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
