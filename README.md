# Employee Leave & Attendance Portal

Full-stack app for employee self-service (attendance and leave management) with an admin console for approvals and user oversight.

## Repo & Deploy Targets
- GitHub Frontend: https://github.com/kuldeepratiwal642-cpu/hr_system_frontend.git
- GitHub Backend: https://github.com/kuldeepratiwal642-cpu/hr_system.git
- Frontend (Vercel): https://hr-system-frontend-e0lydyrxf-kuldeepratiwal642-cpus-projects.vercel.app/login
- Backend API (Railway): https://hrsystem-production-afec.up.railway.app

## Stack
- Frontend: React Js, Vite, Tailwind, React Router, Axios, react-secure-storage
- Backend: Node.js, Express 5, MongoDB (Mongoose), JWT auth, bcrypt, cors, dotenv, nodemon

## Features
- Auth: signup/login with JWT; role-based guard for employee vs admin views.
- Attendance: employees mark present/absent once per day; admins can view everyone.
- Leave: apply/edit/cancel leave, balance tracking; admins approve/reject with automatic balance deduction.
- Admin: list users, review attendance and leave records.

## Quick Start
1) Clone repos and open in terminal or vs code.

### Backend (`hr_system/`)
```bash
npm install
cp .env.example .env    # if you keep a template; otherwise create .env from the sample below
npm start               # starts nodemon on PORT (defaults to 5000 if unset)
```
Environment variables (sample values):
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/your-db
JWT_SECRET=replace-with-strong-secret
PORT=2000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```
Notes:
- On first boot, the server seeds an admin user using `ADMIN_EMAIL` and `ADMIN_PASSWORD` if one does not already exist.

### Frontend (`hr_system_frontend/`)
```bash
npm install
npm run preview             # default Vite dev server (uses PORT=5173 unless overridden)
```
Environment variable:
```
REACT_APP_API_URL=http://localhost:2000/api   # must point at the backend base URL
```
Build & preview:
```bash
npm run build
npm run preview
```

## Folder Map
- `/hr_system` – Express API, MongoDB models, auth/role middleware, attendance/leave/admin routes.
- `/hr_system_frontend` – React SPA (login/signup, employee dashboard, admin dashboard), shared API client with token interceptor.
- `/hr_system_frontend/public` & `hr_system_frontend/dist` – static assets and Vite build output.

## AI Usage Disclosure (2026-03-18)
- AI-generated: this README text, Frontend UI (Just designing) (authored with Codex).
- Human-authored: application code (Express routes/controllers/models, React Logical Stuff i.e Data Fetching, Show featuring etc), environment configuration, and feature logic.
- Friend help: Deployment
