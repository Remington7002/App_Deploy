# CampusConnect Backend (Node.js + Express + MongoDB Atlas)

## Quick start (inside `backend`)

1. Copy these files into your existing `backend` folder, **keep your working `.env` unchanged** and do not publish it.
2. Add to your existing `backend/.env`:
   - `JWT_SECRET=` followed by a random string of 32+ characters (PowerShell: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `SEED_ADMIN_PASSWORD=` followed by a strong temporary demonstration password (10+ characters).
3. `npm install`
4. `npm run seed` (once to create five admin users)
5. `npm run dev`
6. Test `http://localhost:5000/api/health`.

Never commit `.env`; on Render, set `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_URL` in environment variables. `SEED_ADMIN_PASSWORD` is only needed to run the seed script, not to run the server. When running seed with Atlas, ensure your current IP has network access. Rendering to the public internet may require appropriate Atlas network access.

## Demo admin logins

Run `npm run seed` to create these accounts (all use the password from `SEED_ADMIN_PASSWORD`):

- `superadmin@campusconnect.local`
- `cafeteria@campusconnect.local`
- `library@campusconnect.local`
- `it@campusconnect.local`
- `academic@campusconnect.local`

`seed` does not overwrite existing passwords. To change the demo password after seeding, adjust the database entry or delete those five demo users and seed again. Avoid real accounts with the reserved demo email addresses.

## API contract (frontend can integrate these)

All JSON requests with a body require `Content-Type: application/json`. Authenticated endpoints require `Authorization: Bearer <token>`.

### Authentication

- `POST /api/auth/register` → `{ "name": "Ali", "email": "ali@example.com", "password": "securepass123" }` → `{ token, user }`. Registers **students only**.
- `POST /api/auth/login` → `{ "email": "ali@example.com", "password": "securepass123" }` → `{ token, user }`.
- `GET /api/auth/me` → `{ user }`.

### Complaints

- `GET /api/meta/categories` → list of categories and their departments.
- `GET /api/meta/statuses` → statuses.
- `POST /api/complaints` (student) → `{ "title": "WiFi unavailable", "description": "Lab 2 WiFi has not been working since morning", "category": "it", "location": "Lab 2", "priority": "high" }`. Server determines department. Optional: `imageUrl` (external http/https URL, not a file upload).
- `GET /api/complaints` → `{ complaints, pagination }`. Scope enforced on server. Optional query: `status`, `category`, `search`, `page`, `limit`; `department` filter is reserved for Super Admin.
- `GET /api/complaints/:id` → `{ complaint }` with status history and remarks, only if authorized.
- `PATCH /api/complaints/:id/status` (dept admin/super admin) → `{ "status": "in_progress", "note": "Technician notified" }`. Options: `pending`, `in_progress`, `resolved`, `rejected`. Rejection requires a note.
- `POST /api/complaints/:id/remarks` (dept admin/super admin) → `{ "message": "Issue will be checked today" }`.

### Analytics

- `GET /api/dashboard/stats` → `{ total, byStatus, byDepartment, byCategory, resolutionRate, recent }`; role-scoped: students see only their submissions, departmental admins only their department, super admins everything.

## Example login response

```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "...",
    "name": "Ali",
    "email": "ali@example.com",
    "role": "student",
    "department": null
  }
}
```

## Permissions

- Students can create complaints, list/view only their own, and see remarks/history.
- Department admins can list/view/reply/update only their own department's complaints.
- Super admin can list/view/reply/update complaints across all departments.
- Admin privileges are never accepted from student registration input.
- Complaint routing uses server-side category mapping; submitted `department` is ignored.

## Deployment

Deploy on Render as a Web Service:
- Root directory: `backend` (when repository includes `frontend/` + `backend/`)
- Build: `npm install`
- Start: `npm start`
- Env: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` (frontend Vercel origin), optional `PORT` (Render sets this)

Backend URL for React: `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com`. Keep all secrets on server, never in React/Vite environment variables.

## Additional features already included

- Human-readable tracking ticket IDs (`CC-...`)
- Status timeline/history with who changed the status
- Administrator remarks
- Priority labels and location fields
- Per-department and per-category analytics, status totals and resolution rate
- Search, filters and pagination
- Database indexes for faster common queries

**Note:** An image URL can be stored but file uploads/storage are not included. Avoid promising image upload functionality until a storage provider is configured. Test all flows before demo. 
