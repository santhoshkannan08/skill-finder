# SkillFinder

SkillFinder is a React, Express, PostgreSQL MVP for explainable skill assessment and personalized learning roadmaps.

## Implementation checklist

- [x] Establish Vite React client and modular Express server.
- [x] Add shared environment examples, API client, routing, layout and feedback primitives.
- [x] Add PostgreSQL pool, migration and repeatable seed commands.
- [x] Add health and database health endpoints with centralized error handling.
- [x] Add session authentication, CSRF protection, catalog APIs and field-backed onboarding.
- [x] Add deterministic assessment scoring, persisted results and a one-question assessment flow.
- [x] Add prerequisite-aware roadmap generation, optional Gemini personalization and SkillProof flows.

## Prerequisites

- Node.js 20+ and npm 10+
- PostgreSQL 14+
- A PostgreSQL database and server environment variables (see `server/.env.example`)

## Commands

```powershell
npm install
npm run db:migrate --workspace server
npm run db:seed --workspace server
npm run dev
```

Client runs on `http://localhost:5173`; API runs on `http://localhost:4000`.
`GET /api/v1/health` works without a database. `GET /api/v1/health/db` requires a reachable PostgreSQL instance.

## API foundation

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout` (authenticated, CSRF token required)
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/csrf`
- `GET /api/v1/fields`
- `GET /api/v1/fields/:fieldId/paths`
- `GET /api/v1/paths`
- `GET /api/v1/paths/:pathId/skills`

## Roadmap API

Roadmaps are generated from a completed owned assessment, its persisted skill results,
the prerequisite graph and verified resources stored in PostgreSQL:

- `POST /api/v1/roadmaps/generate`
- `GET /api/v1/roadmaps`
- `GET /api/v1/roadmaps/:id`
- `PATCH /api/v1/roadmaps/:id`
- `GET /api/v1/roadmaps/:id/tasks`
- `GET /api/v1/roadmaps/:id/timeline`
- `PATCH /api/v1/roadmaps/:id/tasks/:taskId`

Generate with `{ "assessmentId": 1, "targetDurationDays": 60 }`. Supported standard
durations are 30, 60, 90 and 180 days; custom durations from 1 through 730 days are
validated. The server rejects cyclic prerequisite data and schedules that exceed the
student's available hours with a suggested alternative duration.

## Optional Gemini personalization

Gemini is an optional post-processing service. The deterministic assessment scores,
prerequisite ordering, schedule feasibility and verified resource URLs remain
authoritative. Configure these backend-only values in `server/.env`:

```text
GEMINI_ENABLED=false
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

When enabled, roadmap generation sends only the field, goal, persisted scores,
strengths/gaps, schedule constraints, generated task summaries and verified
catalogue IDs/titles. Recommendations are schema-validated server-side. Unknown
skills/resources, unsafe text, invalid durations and unverified resource
associations are rejected. Timeouts, rate limits, invalid responses and missing
configuration return the deterministic roadmap with `ai_status: "unavailable"` and
never expose provider details or secrets.

## Dashboard, progress and SkillProof API

The dashboard reads all values from PostgreSQL. Task completion is deliberately
separate from skill mastery:

- `POST /api/v1/tasks/:taskId/start` (CSRF protected)
- `POST /api/v1/tasks/:taskId/complete` (CSRF protected)
- `GET /api/v1/progress/overview`
- `GET /api/v1/progress/skills`
- `GET /api/v1/tasks/:taskId/quiz-attempts`
- `POST /api/v1/tasks/:taskId/quiz-attempts` (CSRF protected)
- `POST /api/v1/skill-evidence` (CSRF protected)
- `GET /api/v1/skill-evidence`
- `GET /api/v1/skill-evidence/:evidenceId`

Quiz questions are selected from the persisted question catalog and never
include answer keys. A score of 70% or higher records a passed quiz and may
raise the student's persisted skill profile; a failed attempt returns practice
feedback without changing the authoritative assessment result. Evidence is
stored as `submitted` until it is reviewed, so a student-submitted project
cannot silently claim mastery. Task starts, completions, quiz passes and
evidence submissions are recorded in `roadmap_change_logs`.

## Assessment API

Assessment endpoints require an authenticated session and a CSRF token for state changes:

- `POST /api/v1/assessments`
- `GET /api/v1/assessments`
- `GET /api/v1/assessments/:id/questions`
- `PUT /api/v1/assessments/:id/answers/:questionId`
- `POST /api/v1/assessments/:id/submit`
- `GET /api/v1/assessments/:id/results`

The repeatable assessment seed provides ten questions for web development, science and
commerce paths. Scoring is deterministic and remains available when `GEMINI_API_KEY` is empty.

Create the database before migrating if it does not exist:

```powershell
createdb skillfinder
Copy-Item server\.env.example server\.env
# Set DATABASE_URL and a 32+ character SESSION_SECRET in server\.env
npm run db:migrate --workspace server
npm run db:seed --workspace server
```

Registration and login accept passwords with at least 8 characters, one uppercase letter,
one lowercase letter and one number. Session cookies are HttpOnly, use `SameSite=Lax`,
expire after seven days, and are Secure in production.

## Production deployment

Deploy the Vite client as a static site on Vercel (or an equivalent static hosting
provider) and deploy the Express server to a Node.js-compatible host such as Render,
Railway, Fly.io or an equivalent managed service. Provision PostgreSQL on a secured,
network-accessible PostgreSQL provider. Run migrations and seeds as a release step
before starting the API:

```powershell
npm ci
npm run db:migrate --workspace server
npm run db:seed --workspace server
npm run start
```

Configure these variables on the server, never in the client bundle:

- `NODE_ENV=production`
- `PORT`
- `FRONTEND_ORIGIN` set to the exact HTTPS frontend origin
- `DATABASE_URL` for the secured PostgreSQL instance
- `SESSION_SECRET` as a unique random value of at least 32 characters
- `GEMINI_ENABLED`, `GEMINI_API_KEY` and `GEMINI_MODEL` when AI personalization is enabled

Configure the Vercel project with `VITE_API_BASE_URL` pointing to the deployed API's
`/api/v1` URL. Enable HTTPS on both hosts. Do not use wildcard CORS origins, commit
`.env` files, or expose `DATABASE_URL`, `SESSION_SECRET` or `GEMINI_API_KEY` to the
frontend.

## Testing and release checks

```powershell
npm run build --workspace client
npm test --workspace server
Get-ChildItem -Path server\src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
npm run db:migrate --workspace server
npm run db:seed --workspace server
```

With the API running, verify:

```powershell
Invoke-RestMethod http://localhost:4000/api/v1/health
Invoke-RestMethod http://localhost:4000/api/v1/health/db
```

The final acceptance flow must use a real PostgreSQL database and cover registration,
assessment submission, score persistence, roadmap generation, task progress, SkillProof,
refresh persistence, logout and unauthenticated rejection across at least three
learning paths.

## Troubleshooting

- **`client password must be a string` or database health returns 500:** create
  `server\.env`, set a valid `DATABASE_URL` including the database password, confirm the
  PostgreSQL server is reachable, then rerun migrations.
- **`relation does not exist`:** run `npm run db:migrate --workspace server`, followed by
  `npm run db:seed --workspace server`.
- **CORS errors:** set `FRONTEND_ORIGIN` to the exact browser origin, including scheme,
  hostname and port. Restart the API after changing it.
- **Login or state-changing requests return CSRF errors:** fetch
  `/api/v1/auth/csrf` through the client session and preserve the session cookie and
  returned token.
- **Production startup rejects `SESSION_SECRET`:** configure a unique random secret of
  at least 32 characters; the development fallback is intentionally rejected in
  production.
- **Gemini is unavailable:** set `GEMINI_ENABLED=false`. Deterministic assessment and
  roadmap generation continue to work without Gemini.
