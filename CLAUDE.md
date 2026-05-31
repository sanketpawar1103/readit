# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Readit is a full-stack Reddit-like app. The backend runs on Deno (Hono framework + MongoDB), and the frontend runs on React 19 + TypeScript + Vite + Material UI.

## Development Commands

### Backend (Deno)
```bash
cd backend
deno task dev          # Run with file watching on port 8000
deno test              # Run tests
```

### Frontend (Node/Vite)
```bash
cd frontend
npm install            # Install dependencies
npm run dev            # Dev server on port 5173
npm run build          # TypeScript check + Vite build
npm run lint           # ESLint
```

### Prerequisites
- Local MongoDB running at `mongodb://127.0.0.1:27017` (database: `Readit`)
- Cloudinary credentials in backend env (for image uploads)
- GitHub OAuth credentials in backend env (for GitHub login)

## Architecture

### Backend (`backend/`)
- **Entry**: `main.ts` — initializes MongoDB connection, injects stores into controllers, starts Hono on port 8000
- **Routes**: `src/app.ts` — defines all 8 API routes, CORS middleware (origin: `http://localhost:5173`)
- **Controllers**: `src/controllers/` — handle HTTP logic; receive store instances via constructor injection
  - `authentication_controller.ts` — JWT cookie auth + GitHub OAuth
  - `post_controller.ts` — CRUD for posts, Cloudinary image upload
  - `user_controller.ts` — subscriptions, search, likes
- **Data layer**: `src/modules/` — `post_store_db.ts` and `user_store_db.ts` encapsulate all MongoDB queries
- **Config**: `src/config/setup_db.ts` (MongoDB client), `src/config/cloudinary.ts` (image upload config)

### Frontend (`frontend/src/`)
- **Entry**: `main.tsx` → `App.tsx` — checks auth via `GET /get-user-data`, renders `<Auth>` or `<MainPage>`
- **State**: `Reducer.ts` — single `useReducer` managing posts, user, subscriptions
- **API**: `Api.tsx` — fetch wrapper utilities; all requests use `credentials: 'include'` for JWT cookies
- **Components**: `Feed.tsx`, `CreatePost.tsx`, `SearchBar.tsx`, `Authentication.tsx`
- **UI**: Material UI (MUI 9) with Emotion styling

### Auth Flow
JWT tokens are issued by the backend and stored in **httpOnly cookies**. The frontend always sends `credentials: 'include'` on fetch calls. GitHub OAuth is also supported alongside username/password login.

### Data Flow
Frontend components → `useReducer` dispatch → fetch calls in `Api.tsx` → Hono routes → Controllers → MongoDB stores
