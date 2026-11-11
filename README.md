# School Admission System

First-come-first-served school admission: parents hold a seat in a class/shift, then confirm it by paying the fee before the hold expires.

Stack: .NET 10 Web API, EF Core, PostgreSQL, React (Vite), Docker.

## Run with Docker

Requires only Docker.

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080 (health check: `/health`)
- PostgreSQL: localhost:5432 (data is kept in the `pgdata` volume across `docker compose down` / `up`)

Optional overrides go in a `.env` file at the repository root (see `.env.example`): `DATABASE_URL`, `HOLD_DURATION_SECONDS`, `CORS_ORIGINS`, `API_BASE_URL` (the backend URL the frontend calls).

## Backend

```
backend/
  SchoolAdmission.Api        controllers, error handling, startup, expiry worker
  SchoolAdmission.Services   business rules, DTOs
  SchoolAdmission.Data       DbContext, repositories, migrations
  SchoolAdmission.Domain     entities
  SchoolAdmission.Tests      integration and concurrency tests
```

Run locally without Docker for the API:

```bash
dotnet user-secrets set "ConnectionStrings:Default" "<your connection string>" --project backend/SchoolAdmission.Api
dotnet run --project backend/SchoolAdmission.Api
```

Migrations are applied automatically on startup.

## Frontend

React + TypeScript (Vite), React Query, Tailwind CSS, in `frontend/`.

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on http://localhost:5173. The backend URL comes from `VITE_API_BASE_URL` (see `frontend/.env.example`, default `http://localhost:8080`). In Docker the URL is read at container start from `API_BASE_URL`, so it can be changed without rebuilding the image.

Using the app:

1. Enter the student's 17-digit birth registration number in the bar at the top. It is remembered in the browser.
2. Create classes on **Create class**, then apply on **Classes**. Seat counts refresh every few seconds.
3. The application page shows a live countdown with **Pay admission fee** and **Cancel**. When time runs out it switches to EXPIRED without a reload.
4. **My applications** lists every application for the entered number.

## Tests

```bash
dotnet test backend/backend.slnx
```

Tests run against a real PostgreSQL. By default they start a throwaway container with Testcontainers (Docker must be running). To use an existing database instead, set `TEST_CONNECTION_STRING`. Use a dedicated database for this, because the tests empty the tables.

The concurrency tests send 50 parallel hold requests for 10 seats (and 40 requests through two app instances for 5 seats). They assert that exactly as many holds as seats succeed.

Frontend tests (Vitest + Testing Library):

```bash
cd frontend
npm test
```

See `ASSUMPTIONS.md` for decisions the brief left open.
