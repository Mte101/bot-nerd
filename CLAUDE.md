# bot-nerd — working in this terminal

You are in a live Claude Code session for **bot-nerd**, running in its **development sandbox** on the
Ellac platform. Read `PLAN.md`, `.claude/skills/project-architecture/SKILL.md`, and `PROJECT_CONTEXT.md`
before changing anything.

## This template is blank on purpose

The app you're looking at is **scaffolding only**: a working Vite/React frontend, a working FastAPI
backend, Postgres, and an optional built-in auth system. There is **no dashboard, no settings page,
no example feature** — `frontend/src/pages/Home.tsx` is a placeholder landing page and
`backend/app/app_models.py` is empty. Every feature the app needs is yours to implement.

There are unused building blocks you can reach for rather than writing from scratch:
`components/ui/*` (Button, Card, Input, Badge) and `components/layout/*` (Navbar, Sidebar,
DashboardLayout). Nothing imports them yet. Use them if they fit; ignore or delete them if the app
wants a different shape.

## Build from the plan — and ask the user less

`PLAN.md` is the approved, elaborate plan for this app: its user roles, pages, data model, API surface,
and business rules. **Treat it as the source of truth** and build from it directly — do not re-ask the
user for things the plan already answers. Only ask when a decision is genuinely ambiguous and not
covered by `PLAN.md`.

Specialist **agents** live in `.claude/agents/` — delegate focused work to them instead of doing
everything inline:
- `db-schema` — turn the plan's data model into SQLAlchemy models (`app_models.py`).
- `backend-api-builder` — build FastAPI routers and enforce the plan's business rules.
- `frontend-builder` — build the React pages/components per the plan, following template conventions.
- `qa-tester` — after a feature is built, verify it end to end and report concrete failures.

A good default flow for a new feature: `db-schema` → `backend-api-builder` → `frontend-builder` →
`qa-tester`, then update `PROJECT_CONTEXT.md`.

## You can extend this app freely

This is a full dev environment — build whatever the app needs. You may:
- **Add npm / pip packages** — add them to `frontend/package.json` / `backend/requirements.txt`
  (or `npm install` / `pip install`), then rebuild (see below). Add SDKs when useful.
- **Add features that call third-party services** — payments (Stripe), maps, SMS, email
  (SMTP/SendGrid), storage, analytics, etc. Call their REST API (or SDK); read keys from env vars.
  If a key is missing, guard the feature with a clear in-app message rather than crashing, and tell
  the user which env var to set.
  - **Secrets the user has provided** are listed by NAME in `AVAILABLE_SECRETS.md` (if it exists) —
    read it to see which `os.getenv("NAME")` keys are available. Values are injected into the backend
    at runtime; never hard-code a secret. If a feature needs one that's not listed, guard it and tell
    the user to add it in the dashboard **Secrets** tab.
- **Add file/image uploads, extra services, real-time (WebSockets/SSE)** — whatever the plan calls for.

### ⚠️ Do NOT break these — they make the preview and login work

Editing these breaks the app's URL or its authentication, so leave them intact (you can *read* them):

- **Single-port preview** — `docker-compose.yml`, `demo-proxy/nginx.conf`, `demo-proxy/Dockerfile`,
  and the `APP_PORT` + `VITE_API_URL=` lines in `.env`. The whole app is served on one URL because the
  proxy routes `/` → frontend and `/api` → backend; changing this breaks the preview AND production.
  You MAY add new environment variables to `.env`; just don't change `APP_PORT`/`VITE_API_URL`. If you
  add a service to `docker-compose.yml`, keep the existing `demo-proxy`/`frontend`/`backend`/`postgres`
  services and the single published port intact.
- **Auth core** — `backend/app/auth.py`, `backend/app/models.py` (the `User` model),
  `backend/app/database.py`, `backend/app/api/routers/auth.py`, `frontend/src/lib/auth.tsx`,
  `frontend/src/lib/api.ts`, `frontend/src/pages/Login.tsx`, `frontend/src/pages/Register.tsx`.
  Extend around them (new models in `app_models.py`, new routers registered in `main.py`).
  *Exception:* if the user chooses an external auth provider, these are replaced deliberately —
  see **Authentication** below. `database.py` stays off-limits either way (it's the DB engine).

### Seeing your changes in the preview (rebuild)

The dev app runs as **built images** (no hot-reload). After changing code or dependencies, rebuild the
app's containers so the preview updates — you have `docker` + `docker compose`, and `DOCKER_HOST`
already points at this app's dev daemon. From the project directory:

```
docker compose up -d --build            # rebuild everything
docker compose up -d --build backend    # or just the service you changed (frontend/backend)
```

Then the preview reflects your changes. (Promote/Redeploy to production is still a dashboard button —
don't run deploy/git commands here.)

## Authentication — built-in, or an external service (either way: think about CORS)

Auth is a choice, not a fixture. Two supported paths:

**1. The built-in auth (what ships in this template).** JWT + bcrypt in `backend/app/auth.py`, the
`/api/auth/*` routes, the `User` model, `Login.tsx` / `Register.tsx`, and the `useAuth()` hook. It
works out of the box and needs no external account. Wrap a route in `PrivateRoute` (exported from
`App.tsx`) to require a signed-in user. **CORS:** nothing to do — the frontend calls a relative
`/api/...` through the demo-proxy, so browser requests are *same-origin*. Keep it that way: use
`fetchAPI` and never point the frontend at an absolute backend host/port, which would turn every
call into a cross-origin request.

**2. An external identity provider** — Auth0, Clerk, Supabase Auth, Firebase Auth, an OAuth
provider, or the user's existing SSO. Perfectly fine, and preferable when the user wants social
login, MFA, or an account system they already run. Delete or bypass the built-in login/register
pages, load the provider's SDK (or call its REST API), and have the backend **verify the provider's
token** on every protected endpoint instead of issuing its own. Keep client IDs/domains in `.env`
and secrets in the dashboard **Secrets** tab — never hard-code them.

**CORS is the thing that bites you here.** Once a browser talks to any origin other than this app's
own, both ends must agree:
- **Register this app's origins with the provider.** Its dashboard has allow-lists (allowed callback
  URLs, allowed web origins, allowed logout URLs). Add the **dev preview URL and the production
  URL** — they are different host:port pairs, so an app that works in the sandbox will fail in
  production if only one is listed. Both are plain `http://` (no TLS yet), which some providers
  reject or require you to opt into.
- **Don't call a third-party REST API straight from the browser unless it sends CORS headers.**
  Many APIs (and anything needing a secret key) don't. The fix is to call them from the **backend**
  with `httpx` and expose your own `/api/...` endpoint to the frontend — that also keeps the secret
  off the client, and it stays same-origin.
- **If you do add a cross-origin caller, widen the backend's allow-list properly.** `main.py` reads
  origins from `os.getenv("CORS_ORIGINS")` — add the extra origin to `CORS_ORIGINS` in `.env` and
  rebuild; never hard-code origins in `main.py`. With `allow_credentials=True`, `allow_origins=["*"]`
  is silently ignored by browsers — list real origins.
- **Symptoms to recognise:** "blocked by CORS policy" / "No 'Access-Control-Allow-Origin' header" in
  the browser console, or a preflight `OPTIONS` returning 4xx. That is a *server/provider allow-list*
  problem — fix the allow-list, don't work around it by disabling security in the browser.

Whichever path is chosen, record it in `PROJECT_CONTEXT.md` so later sessions don't reintroduce the
other one.

## Platform-wide instructions

Guidance that applies to every app on this platform — the dashboard buttons (**Save changes**,
**Promote to Production** / **Redeploy production**), when to remind the user to save and redeploy,
and showing plans in the **Review** tab — is loaded from your user-level CLAUDE.md, maintained by
the platform in one place. Don't duplicate it here; this file is for what is specific to THIS app.
