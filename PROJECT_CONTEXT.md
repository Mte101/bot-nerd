# bot-nerd — Project Context

## What this project is meant to be
A structured learning platform where users discover, enroll in, and progress through courses on bot development, automation, and AI topics.

Requested features (from the approved plan):
- Browse Course Catalog
- Course Detail Page
- Course Enrollment
- My Learning Dashboard
- Lesson Viewer
- Mark Lesson Complete
- Lesson Bookmarks
- Take Module Quiz
- Quiz Results & Feedback
- Quiz Retake
- Automatic Certificate Issuance
- Certificate Download
- Course Reviews & Ratings
- Create & Edit Course
- Module & Lesson Management
- Video & File Uploads
- Quiz Builder
- Submit Course for Review
- Instructor Analytics
- Course Pricing
- Stripe Checkout
- Payment Confirmation Webhook
- Purchase History
- Coupon / Discount Codes
- Course Approval Queue
- User Management
- Category & Tag Management
- Platform Analytics Dashboard
- Content Moderation

**This template is deliberately blank.** It ships infrastructure only — a running Vite/React
frontend, a running FastAPI backend, a database, and an optional built-in auth system. There is no
dashboard, no settings page, no example feature. Nothing in the list above is built yet: treat it as
the backlog and implement it here. Update this file's File map as you build.

## Ports
Frontend: http://localhost:21402
Backend: http://localhost:21403
These are this project's actual assigned ports (also in `.env`'s `CORS_ORIGINS`/`VITE_API_URL` and
`docker-compose.yml`'s `ports:`). Don't guess or reuse another project's port — if you ever need to
change them (e.g. to resolve a host port conflict), update `.env` and `docker-compose.yml` together
and record the new values here.

## Authentication — your choice
Two supported options, see CLAUDE.md's "Authentication" section for the full trade-off and the CORS
rules that come with each:
1. **Built-in (what ships here)** — JWT + bcrypt in `backend/app/auth.py`, `/api/auth/*` routes,
   `Login.tsx`/`Register.tsx`, `useAuth()`. Same-origin through the proxy, so no CORS work.
2. **External provider** (Auth0, Clerk, Supabase, Firebase, …) — fine to use instead; the built-in
   pages can be deleted. You must then register this app's origins with the provider and keep
   third-party API calls CORS-safe (proxy them through the backend when they aren't).

## File map
backend/app/main.py — FastAPI entry; registered routers: [auth] — add new routers here with app.include_router()
backend/app/app_models.py — app-specific SQLAlchemy models: [none yet] — add new models here, never in models.py
backend/app/auth.py — JWT token creation/verification, bcrypt password hashing, OAuth2PasswordBearer dependency
backend/app/models.py — SQLAlchemy `User` model (id, name, email, hashed_password, is_active, created_at) — never redefine here
backend/app/schemas.py — UserCreate, UserResponse, Token, LoginRequest, UpdateUserRequest
backend/app/database.py — async SQLAlchemy engine/session setup
backend/app/api/routers/auth.py — POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, PATCH /api/auth/me
frontend/src/main.tsx — React + react-router-dom + AuthProvider setup, mounts <Toaster />
frontend/src/App.tsx — route table; routes so far: /, /login, /register (+ catch-all → /) — add a `<Route>` here for every new page
frontend/src/pages/Home.tsx — blank landing page; replace it with the app's real home screen
frontend/src/lib/api.ts — fetchAPI() helper: auto auth header injection, 401 → redirect to /login
frontend/src/lib/auth.tsx — AuthProvider, useAuth() hook (login/logout/refreshUser)
frontend/src/pages/Login.tsx — email/password sign-in (built-in auth; delete if using a provider)
frontend/src/pages/Register.tsx — name/email/password registration, 8-char password minimum

### Unused building blocks (nothing imports these yet — use them or ignore them)
frontend/src/components/layout/DashboardLayout.tsx — wraps Navbar + Sidebar + page content
frontend/src/components/layout/Navbar.tsx — top bar: app name, user avatar, logout (renders null when signed out)
frontend/src/components/layout/Sidebar.tsx — left nav, takes a NavLink[] array
frontend/src/components/ui/Button.tsx — variants: default, outline, ghost, destructive
frontend/src/components/ui/Card.tsx — Card, CardHeader, CardTitle, CardContent, CardFooter
frontend/src/components/ui/Input.tsx — label, error, helperText, password eye-toggle
frontend/src/components/ui/Badge.tsx — variants: default, secondary, success, destructive, warning

## Key exports & props
PrivateRoute — named export from @/App; wrap a `<Route element={...}>` to require a signed-in user
DashboardLayout — named export from @/components/layout/DashboardLayout; requires `links: NavLink[]`
NavLink — `{ label: string; href: string; icon: LucideIcon }`
fetchAPI — from @/lib/api; handles auth headers + 401 auto-logout
useAuth — from @/lib/auth; returns `{ user, login, logout, refreshUser }`

## API routes
POST /api/auth/register — create user, returns access_token
POST /api/auth/login — validate email/password, returns access_token
GET /api/auth/me — returns current UserResponse (requires token)
PATCH /api/auth/me — update user name (requires token)

## Database models (models.py)
User(id, name, email, hashed_password, is_active, created_at)

## Installed packages
Frontend: vite, react, react-dom, react-router-dom, lucide-react, react-hot-toast, tailwindcss, clsx, tailwind-merge
Backend: fastapi, sqlalchemy, asyncpg, pydantic, python-jose, passlib, bcrypt, httpx, python-multipart

## Conventions
- Use fetchAPI() for all API calls — never hardcode URLs or origins
- Navigation: `useNavigate` from react-router-dom (NOT Next.js `useRouter`)
- Links: `import { Link } from 'react-router-dom'` with `to=` (NOT Next.js `href=`)
- No Next.js imports anywhere — this is a Vite + React app
- toast from react-hot-toast for user feedback
- New models → app_models.py only; new routers → register in main.py with app.include_router()
- New pages → frontend/src/pages/PageName.tsx AND add a `<Route>` in App.tsx
- Dashboard-style pages (if you build one): `import { DashboardLayout } from "@/components/layout/DashboardLayout"` and pass the same NAV_LINKS array to every one

### Hard off-limits — never overwrite these
**Infrastructure:** frontend/Dockerfile, backend/Dockerfile, docker-compose.yml, .env, frontend/vite.config.ts, frontend/tsconfig.json, frontend/tsconfig.node.json, frontend/tailwind.config.js, frontend/postcss.config.js, frontend/index.html
**Auth core (only while you use the built-in auth):** backend/app/database.py, backend/app/models.py, backend/app/auth.py, backend/app/schemas.py, backend/app/api/routers/auth.py, backend/app/__init__.py, backend/app/api/__init__.py, backend/app/api/routers/__init__.py, frontend/src/lib/api.ts, frontend/src/lib/auth.tsx, frontend/src/pages/Login.tsx, frontend/src/pages/Register.tsx
**App shell:** frontend/src/main.tsx, frontend/src/index.css
(`database.py` stays off-limits either way — it's the DB engine, not auth. If the user picks an
external provider, the rest of the auth core may be replaced deliberately; see CLAUDE.md.)
