# School Admission System

An online admission system for a private school where seats are given on a first-come, first-served basis. Every class and shift (for example "Class 6 – Morning Shift") has a fixed number of seats. A parent applies with the student's 17-digit birth registration number, which holds a seat for a limited time. Paying the admission fee before the timer runs out confirms the seat. If the fee isn't paid in time, the seat is released on its own for the next applicant.

The school admin creates classes and parents apply, pay and cancel, all from the web UI. Seat counts never go over capacity, even when many parents apply at the same moment or the backend runs as more than one process.

**Stack:** .NET 10 Web API, EF Core, PostgreSQL, React + TypeScript (Vite), React Query, Tailwind CSS, Docker.

## Features

- **Classes:** every class and shift with total, held, confirmed and available seats, refreshed every few seconds without a reload.
- **Apply:** holds a seat for `HOLD_DURATION_SECONDS` (default 600) for the entered student.
- **Application:** live countdown with **Pay admission fee** and **Cancel**. It switches to EXPIRED by itself when the time runs out.
- **My applications:** every application for the entered birth registration number. It is still there after a refresh or reopening the browser.
- **Create class:** for the school admin, with class (1–10) and shift (Morning/Day) dropdowns.
- Clear error messages for full classes, expired holds, invalid input and an unreachable server.
- Dark and light themes.

## Setup

### Run everything with Docker (recommended)

Requires only Docker.

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 (health check: `/health`) |
| PostgreSQL | localhost:5432 |

Data is kept in the `pgdata` volume, so it survives `docker compose down` and `docker compose up`. Stop everything with `docker compose down`.

Optional overrides go in a `.env` file at the repository root (copy `.env.example`):

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | bundled Postgres container | Use an external PostgreSQL (`Host=...` or `postgresql://...` URL) |
| `HOLD_DURATION_SECONDS` | `600` | How long a seat stays held before it is released |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Frontend origins allowed to call the API |
| `API_BASE_URL` | `http://localhost:8080` | Backend URL the frontend calls, read when the container starts |

### Run without Docker

**Backend** (needs .NET 10 SDK and a PostgreSQL database):

```bash
dotnet user-secrets set "ConnectionStrings:Default" "<your connection string>" --project backend/SchoolAdmission.Api
dotnet run --project backend/SchoolAdmission.Api
```

The API starts on http://localhost:8080. Migrations are applied automatically on startup.

**Frontend** (needs Node.js 20+):

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on http://localhost:5173. The backend URL comes from `VITE_API_BASE_URL` (see `frontend/.env.example`, default `http://localhost:8080`).

### Using the app

1. Enter the student's 17-digit birth registration number in the bar at the top.
2. Create a class on **Create class**, then click **Apply** on **Classes**.
3. On the application page, click **Pay admission fee** before the timer ends to confirm, or **Cancel** to release the seat.
4. Open **My applications** to see every application for that number.

To watch a hold expire quickly, start with `HOLD_DURATION_SECONDS=30`.

## Project structure

```
backend/
  SchoolAdmission.Api        controllers, error handling, startup, expiry worker
  SchoolAdmission.Services   business rules, DTOs
  SchoolAdmission.Data       DbContext, repositories, migrations
  SchoolAdmission.Domain     entities
  SchoolAdmission.Tests      integration and concurrency tests
frontend/
  src/pages, containers, components, hooks, services, api
docker-compose.yml
```

## API

Base URL `http://localhost:8080`. The student is identified by the `X-Student-Id` header (17 digits).

| Method | Path | Purpose |
|---|---|---|
| POST | `/classes` | Create a class |
| GET | `/classes` | All classes with seat counts |
| GET | `/classes/{classId}` | One class with seat counts |
| POST | `/classes/{classId}/holds` | Apply (hold a seat) |
| GET | `/holds/{holdId}` | Application status |
| POST | `/holds/{holdId}/confirm` | Pay the fee and confirm |
| DELETE | `/holds/{holdId}` | Cancel an application |
| GET | `/me/holds` | All applications of the student |
| GET | `/class-options` | Class and shift choices for the create form |

Errors are returned as problem details with a readable `detail` and a machine-readable `code` (for example `NO_SEATS_AVAILABLE`, `HOLD_EXPIRED`, `ALREADY_APPLIED`). `backend/SchoolAdmission.Api/SchoolAdmission.Api.http` has sample requests for every endpoint.

## Testing

### Backend

```bash
dotnet test backend/backend.slnx
```

The tests run against a real PostgreSQL. By default they start a throwaway container with Testcontainers, so Docker must be running. To use an existing database instead, set `TEST_CONNECTION_STRING`. Use a dedicated database, because the tests empty the tables.

They cover:
- creating classes, including validation and duplicate names
- holding, confirming (also twice), cancelling, expiry, and other students' applications
- concurrency: 50 parallel hold requests for 10 seats, and 40 requests through two app instances on one database for 5 seats. Exactly as many holds as seats succeed.

### Frontend

```bash
cd frontend
npm test
```

Vitest and Testing Library tests cover:
- the countdown and expiry logic
- form validation
- the Apply button turning off when a class is full or no student number is entered
- the application card switching to EXPIRED and hiding Pay once time runs out

### Manual check

1. Run `docker compose up --build` with `HOLD_DURATION_SECONDS=30` in `.env`.
2. Open http://localhost:3000.
3. Create a class with 1 seat and apply as one student.
4. Apply as a second student. You should see "No seats left".
5. Wait for the first hold to expire. The page shows EXPIRED and the seat becomes free again.

See `ASSUMPTIONS.md` for the decisions the brief left open.
