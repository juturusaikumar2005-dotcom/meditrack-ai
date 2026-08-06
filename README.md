# MEDITRACK AI — Monorepo Architecture & Deployment Guide

> **Production Deployment Architecture**: Single GitHub Monorepo  
> **Frontend**: React + Vite (Root Directory: `./`) → Deployed to **Vercel** / **Netlify**  
> **Backend**: Express.js API (Root Directory: `server/`) → Deployed to **Render** / **Railway**  
> **Auth & Database**: Supabase Auth + PostgreSQL  
> **AI Engine**: Google Gemini API

---

## 📁 Repository Structure

This repository is structured as a **single monorepo** containing two completely independent applications:

```
meditrack-ai/                   ← Single Monorepo Root (GitHub Repository)
│
├── src/                        ← React 19 Frontend Source Code
├── public/                     ← Static Web Assets
├── index.html                  ← Vite Entry Point HTML
├── package.json                ← Frontend Dependencies & Build Scripts
├── vite.config.ts              ← Vite Configuration & Alias Setup
├── tsconfig.json               ← TypeScript Compiler Settings
├── .env                        ← Local Frontend Environment Variables (Gitignored)
├── .env.example                ← Frontend Environment Variable Template
│
├── server/                     ← Express.js Backend Subfolder
│   ├── index.js                ← Express Application Server Entry
│   ├── package.json            ← Backend-Only Dependencies & Run Scripts
│   ├── routes/                 ← API Route Handlers (auth.js, ai.js)
│   ├── .env                    ← Local Backend Environment Variables (Gitignored)
│   └── .env.example            ← Backend Environment Variable Template
│
├── vercel.json                 # SPA Rewrite Rules for Single-Page Routing
├── .gitignore                  # Git Ignore Rules (Excludes node_modules & .env)
└── README.md                   # Complete Deployment & DevOps Documentation
```

---

## ⚙️ Environment Variables Matrix

### Frontend (`/.env` & `/.env.example`)
*Exposed to the browser via `import.meta.env` — Contains public keys and API URL only.*

| Variable | Description | Example (Production) |
|---|---|---|
| `VITE_API_URL` | Base URL of deployed Express backend API | `https://meditrack-backend.onrender.com/api` |
| `VITE_SUPABASE_URL` | Your Supabase Project URL | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Anonymous Public Key | `eyJhbGciOi...` |

### Backend (`/server/.env` & `/server/.env.example`)
*Server-side runtime only — Private keys, never committed or exposed to the client.*

| Variable | Description | Example (Production) |
|---|---|---|
| `PORT` | Listening Port for Express Server | `5000` |
| `JWT_SECRET` | Secret key used for signing JWT tokens | `your_long_random_jwt_secret` |
| `SUPABASE_URL` | Your Supabase Project URL | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Private Supabase Service Role Key | `eyJhbGciOi...` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |

---

## 🚀 Step-by-Step Deployment Instructions

### 1. Backend Deployment (Render / Railway)

1. Push this entire repository to your single **GitHub Repository**.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name**: `meditrack-backend`
   - **Root Directory**: `server` *(CRITICAL: Tell Render to use the `/server` folder)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add the Backend Environment Variables:
   - `PORT`: `5000`
   - `JWT_SECRET`: `<your-secure-jwt-secret>`
   - `SUPABASE_URL`: `https://<your-project-ref>.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<your-supabase-service-role-key>`
   - `GEMINI_API_KEY`: `<your-google-gemini-api-key>`
6. Click **Create Web Service**. Copy your backend live URL (e.g. `https://meditrack-backend.onrender.com`).

---

### 2. Frontend Deployment (Vercel)

1. Log into [Vercel Dashboard](https://vercel.com/) and click **Add New...** → **Project**.
2. Import the exact same GitHub repository.
3. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` *(Leave default: root of repository)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the Frontend Environment Variables:
   - `VITE_API_URL`: `https://meditrack-backend.onrender.com/api` *(Points to live Render backend)*
   - `VITE_SUPABASE_URL`: `https://<your-project-ref>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<your-supabase-anon-key>`
5. Click **Deploy**. Your frontend is live!

---

### 3. Supabase Auth & Redirect Setup

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **Providers** → **Google**.
2. Enable Google Provider and enter your **Client ID** & **Client Secret** from Google Cloud Console.
3. Open **Authentication** → **URL Configuration**:
   - **Site URL**: `https://your-frontend-app.vercel.app`
   - **Redirect URLs**: Add `https://your-frontend-app.vercel.app/auth/callback` and `http://localhost:5173/auth/callback`.

---

## 💻 Local Development Setup

### Running Frontend & Backend Simultaneously

```bash
# Terminal 1: Run Express Backend API
cd server
npm install
npm run dev
# Running on http://localhost:5000

# Terminal 2: Run React Vite Frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🔒 Security & Architecture Guarantees

- **No Shared Dependencies**: `package.json` at root is 100% frontend. `/server/package.json` is 100% backend.
- **Zero Exposed Secrets**: `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are strictly server-side.
- **Single Source Repository**: Deploys cleanly from one single GitHub repository without needing separate repos.
