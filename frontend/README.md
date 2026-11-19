# CampusConnect Frontend — BIIT competition

React + Vite, responsive design (desktop/tablet/mobile), brand green, BIIT logo, modular components, shared API client and auth context.

## Install in your existing CampusConnect_starter project

1. Copy the `frontend` folder from this ZIP into `CampusConnect_starter/` and **replace** its old frontend files. This ZIP does not contain backend files, so it will not overwrite your working MongoDB `.env`.
2. Inside the new `frontend` folder run `npm install` then `npm run dev`.
3. Open `http://localhost:5173`. Keep the backend running on `http://localhost:5000`.
4. If your backend is running on another URL, create `frontend/.env` containing `VITE_API_URL=http://localhost:5000` (or the deployed backend URL), then restart Vite.

## Key paths

- `src/lib/api.js`: one REST API client with bearer token
- `src/lib/config.js`: centralized UI labels for categories, departments, statuses
- `src/context/AuthContext.jsx`: authentication state and session actions
- `src/components/`: reusable components, responsive application shell
- `src/pages/`: role-specific login, dashboard, complaints, new complaint, details, analytics
- `src/styles.css`: CSS variables and mobile-first breakpoints (650, 820, 1050, 1250)
- `public/biit-logo.jpg`: official provided BIIT logo in white circular seal

## Live API contract

Matches the complete CampusConnect backend ZIP:
- `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`
- `GET/POST /api/complaints`, `GET /api/complaints/:id`
- `PATCH /api/complaints/:id/status`, `POST /api/complaints/:id/remarks`
- `GET /api/dashboard/stats`

Admin account emails (created by `npm run seed` in backend): `superadmin@campusconnect.local`, `cafeteria@campusconnect.local`, `library@campusconnect.local`, `it@campusconnect.local`, `academic@campusconnect.local`. Password is the secret configured in backend `SEED_ADMIN_PASSWORD` at seed time.

## Deploy quickly

Deploy `frontend` on Vercel (Vite preset): root directory `frontend`, build `npm run build`, output `dist`.
Set Vercel environment variable `VITE_API_URL` to your Render backend URL (no trailing slash), then redeploy. Set Render backend environment variable `FRONTEND_URL` to the exact production Vercel origin and redeploy backend; the backend enables CORS for that origin.

`vercel.json` is included so pages like `/complaints/123` work on refresh.

## Architecture / limitations

The client hides pages appropriately but **the backend must enforce actual authorization**. Role and department scope are validated in backend routes. All complaint-routing takes place server-side and students cannot set `department` or admin privileges. This frontend uses a browser-stored JWT for competition simplicity; for production, review cookie-based auth, CSRF defenses, refresh tokens and deployment security.

Supporting images are currently **external URL only**, not file uploads. Charts show real data; they are not fabricated. Empty states guide judges when the database is empty. A fast demonstration is student registration → complaint → department admin response → super admin analytics.

## Testing

`npm run build` should succeed. After deploying, test role-switching in a private browser window, complaint submission, admin status/reply, and all dashboard graphs. Have a student and a few complaints seeded manually for judges.
