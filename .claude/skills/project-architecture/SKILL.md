---
name: project-architecture
description: Read this before adding any feature, page, model, or endpoint to this project — explains the base template architecture and how to work on it without blowing the session's context budget.
---

## What this project starts from
bot-nerd was scaffolded from Ellac's **blank** full-stack template: a FastAPI + SQLAlchemy (async)
backend and a React + Vite + TypeScript + Tailwind frontend, wired together and running, with
**no features built**. `pages/Home.tsx` is a placeholder landing page; `app_models.py` is empty.
Optional built-in JWT auth ships with it (Login/Register + `/api/auth/*`), and an unused UI kit
(Button/Card/Input/Badge) plus layout shell (Navbar/Sidebar/DashboardLayout) sit ready to be used or
deleted. Everything else is yours to build.

## Authentication is a choice
The built-in JWT auth can stay, or be swapped for an external provider (Auth0, Clerk, Supabase,
Firebase, the user's SSO). CLAUDE.md's "Authentication" section covers both paths and — importantly —
the CORS rules each one implies. Whichever is chosen, record it in PROJECT_CONTEXT.md.

## This is a base, not a finished app
Nothing here is final. Add pages, models, endpoints, components — anything the user asks for.
The only files to leave alone are the small "hard off-limits" list (auth core, infra/build config,
app shell) — see PROJECT_CONTEXT.md's Conventions section for the exact list.

## Where the current truth lives
`PROJECT_CONTEXT.md` (project root) is the live inventory of what's actually been built — file map,
routes, models, exports. Read it before touching anything. Update it as your last step after any
change, the same way the platform's own automated build pipeline does.

## Check for port conflicts before building or deploying
This project's own ports are recorded in `PROJECT_CONTEXT.md`'s "Ports" section (and in `.env`/
`docker-compose.yml`) — check there first rather than guessing or assuming defaults.
This project's containers run alongside other Ellac-generated projects on the same Docker host.
Before running `docker compose up` (or anything that starts/restarts this project's containers),
run `docker ps --format '{{.Names}}\t{{.Ports}}'` first and check the ports this project's
docker-compose.yml publishes (frontend/backend/postgres) aren't already bound by another
project's container on the host. If there's a conflict, change the conflicting `ports:` mapping
in this project's docker-compose.yml to a free host port (and update `.env`/`VITE_API_URL`
accordingly) before bringing containers up. Only treat the port setup as complete once you've
confirmed `docker compose up` actually reports the containers as running/healthy — a returned
preview URL does not by itself guarantee the containers started successfully.

## Browser-testing this app from inside the environment
The published host ports and the containers' own IPs are NOT reachable from this shell or a
headed browser running here via `localhost` — only via `host.docker.internal` (the Docker bridge
gateway, e.g. `http://host.docker.internal:{frontend_port}`). Because Vite bakes `VITE_API_URL`
into the bundle **at build time**, any browser-driven E2E run from here requires the frontend to
have been built with `VITE_API_URL=http://host.docker.internal:{backend_port}` and the backend's
`CORS_ORIGINS` to include `http://host.docker.internal:{frontend_port}` (keep the plain
`localhost` origin/URL too, so a real browser on the host machine still works normally — don't
replace it, add to it). After changing `VITE_API_URL` you must `docker compose up -d --build
frontend` to re-bake the bundle — editing `.env` alone does nothing for the frontend until
rebuilt. Headed Chromium runs on the DISPLAY written to `.display` in this project's root (check
that file rather than assuming a number); Playwright is installed globally. Note: if this
project's setup resets the database on backend restart, restarting it to pick up env changes
wipes existing test data — fine for a fresh E2E run (register new test accounts), but avoid
restarting if you need to preserve existing data.

## Use subagents for feature work
This terminal session is long-lived — you'll come back to it for every feature request on this
project, so keep its own context small. For any non-trivial feature:
1. In the main session: read the request, skim PROJECT_CONTEXT.md if needed.
2. Dispatch the actual implementation (reading/writing/editing files) to a subagent via the Task
   tool. Tell it explicitly to read PROJECT_CONTEXT.md first and update it last.
3. If the subagent runs in the background or is likely to take more than a couple of minutes
   (e.g. multi-step builds, test runs, browser-driven flows), explicitly instruct it up front to
   post a short progress update after each major step, not just a final report. Otherwise the
   only signal you get is silence until completion, which looks identical to a stall.
4. Back in the main session: review what the subagent changed, don't re-read everything yourself.

## Keeping this file true
PROJECT_CONTEXT.md tracks file-level inventory and updates every feature. This file (SKILL.md)
only needs updating when something architectural changes — a new convention, a new off-limits
file, a stack swap. If that happens, update this file too.
