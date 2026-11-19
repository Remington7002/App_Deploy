# CampusConnect starter (competition)

## Setup MongoDB Atlas
1. Create a free-tier Atlas cluster; create a database user with read/write access to the `campusconnect` database.
2. Under Network Access, add your current IP. To connect from Render using a dynamic outbound IP, you may temporarily add `0.0.0.0/0` **only for the competition**, use a strong unique password, and restrict it afterward.
3. In Connect > Drivers > Node.js, copy the `mongodb+srv://...` connection string; put `/campusconnect` between the hostname and `?`. URL-encode special characters in the password.

## Backend
```powershell
cd backend
Copy-Item .env.example .env
# Edit backend/.env and replace MONGO_URI with your real URI
npm install
npm run dev
```
Check http://localhost:5000/api/health : `status=ok`, `database=connected`.

## Frontend (second terminal)
```powershell
cd frontend
npm install
npm run dev
```
Visit http://localhost:5173.

## Render backend deployment
1. Push this repository to GitHub; **never** commit .env.
2. Render > New > Web Service > Connect repository.
3. Root directory: `backend`; Build command: `npm install`; Start command: `npm start`.
4. Environment: add `MONGO_URI` (entire URI), `FRONTEND_URL` (your eventual Vercel frontend URL). Do not add PORT manually; the code uses Render's PORT.
5. Deploy and check `https://YOUR-SERVICE.onrender.com/api/health`.

## Vercel frontend deployment
1. Vercel > Add New Project > Import GitHub repo.
2. Root directory: `frontend`, Framework: Vite; Build: `npm run build`; Output: `dist`.
3. Set build environment `VITE_API_URL=https://YOUR-SERVICE.onrender.com` (no trailing slash), then deploy.
4. Copy the Vercel frontend URL into Render `FRONTEND_URL` and redeploy/restart backend.
5. Test the final Vercel URL in a different browser/device.

## Planned model and routes
- `users`: name, email, passwordHash, role, department.
- `complaints`: studentId, title, description, category, department, status, remarks, timestamps.
- Server must enforce access control; do not rely on frontend hiding buttons.
- Next: auth, category routing, complaint CRUD, dashboards.
