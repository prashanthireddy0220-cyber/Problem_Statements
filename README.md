# Event ALPHA — College Hackathon & Centralized Attendance Platform

Production-ready web platform for college hackathons featuring **Problem Statement Reading & Selection**, **Single-Device Team Lead Security**, **Centralized Attendance Management**, **Volunteer QR Scanning**, and **Admin Master Dashboard**.

---

## Project Structure

```text
Problem_Statements/
├── server/                 # Node.js Express Backend API Server
│   ├── config/             # Centralized environment configuration (env.js)
│   ├── models/             # Mongoose & database schemas (Schema.js)
│   ├── routes/             # REST API routes (auth, problems, attendance, admin)
│   ├── .env                # Local backend environment secrets (git-ignored)
│   └── .env.example        # Backend environment variables template
│
├── client/                 # React SPA (Vite) Frontend
│   ├── src/                # Components, Pages, Context, Styles
│   ├── .env                # Local frontend environment secrets (git-ignored)
│   └── .env.example        # Frontend environment variables template
│
├── .gitignore              # Git ignore rules for node_modules and .env files
├── package.json            # Root scripts for launching server and client
└── README.md               # Project documentation and setup guide
```

---

## Environment Variables Configuration

### 1. Backend Environment Setup (`server/.env`)

Copy the template file to create your local `.env`:

**On Linux / macOS:**
```bash
cd server
cp .env.example .env
```

**On Windows PowerShell:**
```powershell
cd server
Copy-Item .env.example .env
```

#### Backend Environment Variables Explanation:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `PORT` | HTTP Port for Express Backend Server | `5000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `MONGODB_URI` | MongoDB Atlas or local connection URI. Leave blank for auto embedded MongoDB. | `""` |
| `JWT_SECRET` | Secret key for signing authentication JSON Web Tokens | `alpha_hackathon_super_secret_jwt_key_2026` |
| `SESSION_SECRET` | Secret key for server session management | `alpha_hackathon_session_secret_key_2026` |
| `FRONTEND_URL` | Allowed CORS origin URL for deployed frontend | `http://localhost:5173` |
| `APP_BASE_URL` | Backend server URL | `http://localhost:5000` |
| `ADMIN_USERNAME` | Default seed administrator username | `admin` |
| `ADMIN_PASSWORD` | Default seed administrator password | `admin123` |
| `READING_DURATION_MINUTES` | Initial default problem reading timer duration | `30` |
| `SELECTION_DURATION_MINUTES` | Initial default problem selection timer duration | `5` |
| `MAX_FILE_SIZE_MB` | File upload limit in MB | `10` |

---

### 2. Frontend Environment Setup (`client/.env`)

Copy the template file to create your local `.env`:

**On Linux / macOS:**
```bash
cd client
cp .env.example .env
```

**On Windows PowerShell:**
```powershell
cd client
Copy-Item .env.example .env
```

#### Frontend Environment Variables Explanation:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base API Endpoint URL for Axios API requests | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Event branding title | `ALPHA` |
| `VITE_APP_BASE_URL` | Frontend application URL | `http://localhost:5173` |

---

## Installation & Running Locally

### Step 1: Install Dependencies

**Install Backend Dependencies:**
```bash
cd server
npm install
```

**Install Frontend Dependencies:**
```bash
cd client
npm install
```

### Step 2: Run Backend & Frontend Server

**Start Express Server (Port 5000):**
```bash
cd server
npm start
```
*Note: If `MONGODB_URI` is not provided in `.env`, the server automatically spins up an embedded MongoDB engine with disk persistence.*

**Start Frontend Development Server (Port 5173):**
```bash
cd client
npm run dev
```

Open your browser at **`http://localhost:5173`** (or **`http://localhost:5000`**).

---

## Testing Credentials

| Portal Role | URL | Username / Identifier | Password |
| :--- | :--- | :--- | :--- |
| **Team Lead** | `/team-lead/login` | `HACK2026-001` | *N/A (Reg Number)* |
| **Admin** | `/admin/login` | `admin` | `admin123` |
| **Volunteer** | `/volunteer/login` | `volunteer1` | `vol123` |

---

## Deployment Guide

### Deploying Frontend to Vercel
1. Connect your GitHub repository to Vercel.
2. Set Root Directory to `client`.
3. Configure Environment Variables in Vercel Dashboard:
   - `VITE_API_URL` = `https://your-backend-api.onrender.com/api`
   - `VITE_APP_NAME` = `ALPHA`
   - `VITE_APP_BASE_URL` = `https://your-app.vercel.app`
4. Click **Deploy**.

### Deploying Backend to Render / Heroku
1. Create a Web Service on Render.
2. Set Root Directory to `server`.
3. Set Build Command to `npm install`.
4. Set Start Command to `node server.js`.
5. Add Environment Variables:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://user:password@cluster.mongodb.net/hackathon`
   - `JWT_SECRET` = `your_production_jwt_secret`
   - `FRONTEND_URL` = `https://your-app.vercel.app`
