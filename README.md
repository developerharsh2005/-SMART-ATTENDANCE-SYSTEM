# Smart Attendance System

A production-ready university attendance platform with React, Tailwind CSS, Node.js, Express, MongoDB, JWT authentication, role-based access control, reports, analytics, QR/manual attendance flows, notifications, exports, audit logs, and PWA support.

## Stack

- Frontend: React, Vite, Tailwind CSS, Recharts, Lucide icons
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcrypt, role-based access for Admin, Teacher, Student
- Optional AI hooks: face recognition and attendance prediction service stubs

## Folder Structure

```text
smart-attendance-system/
  backend/
    src/config       Mongo connection
    src/middleware   Auth, RBAC, validation, errors
    src/models       Mongoose schemas
    src/routes       API routes
    src/utils        JWT, exports, seed data
  frontend/
    src/components   Layout and reusable UI
    src/context      Auth and theme providers
    src/pages        Landing, auth, dashboards
    src/data         Demo UI data
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Configure backend:

```bash
cp backend/.env.example backend/.env
```

3. Start MongoDB locally or point `MONGODB_URI` to Atlas.

4. Seed sample data:

```bash
npm run seed
```

5. Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:5000/api`

## Demo Accounts

- Admin: `admin@university.edu` / `Password123!`
- Teacher: `teacher@university.edu` / `Password123!`
- Student: `student@university.edu` / `Password123!`

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/courses`
- `POST /api/courses`
- `POST /api/attendance/mark`
- `GET /api/attendance`
- `PATCH /api/attendance/:id`
- `GET /api/reports/summary`
- `GET /api/reports/export.csv`
- `GET /api/notifications`
- `POST /api/notifications`
- `GET /api/audit-logs`

## Deployment Notes

- Set `JWT_SECRET`, `MONGODB_URI`, `CLIENT_URL`, and email provider variables in production.
- Serve `frontend/dist` behind a CDN or static host.
- Deploy `backend` as a Node service with HTTPS and a managed MongoDB instance.
- The frontend includes a web manifest and service worker for a mobile-friendly PWA shell.
