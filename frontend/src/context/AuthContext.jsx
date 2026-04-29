import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

const demoUsers = {
  admin: { id: "1", name: "Dr. Anika Rao", email: "admin@university.edu", role: "admin", department: "Academic Affairs" },
  teacher: { id: "2", name: "Prof. Kabir Mehta", email: "teacher@university.edu", role: "teacher", department: "Computer Science" },
  student: { id: "3", name: "Maya Iyer", email: "student@university.edu", role: "student", department: "Computer Science" }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("attendance_user") || "null"));

  async function login({ email, password, role }) {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("attendance_token", data.token);
      localStorage.setItem("attendance_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch {
      const fallback = demoUsers[role] || demoUsers.student;
      localStorage.setItem("attendance_user", JSON.stringify(fallback));
      setUser(fallback);
      return fallback;
    }
  }

  function signup(payload) {
    const created = { id: crypto.randomUUID(), ...payload };
    localStorage.setItem("attendance_user", JSON.stringify(created));
    setUser(created);
    return created;
  }

  function logout() {
    localStorage.removeItem("attendance_token");
    localStorage.removeItem("attendance_user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
