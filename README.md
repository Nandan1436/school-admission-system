# School Admission System

First-come-first-served school admission: parents hold a seat in a class/shift, then confirm it by paying the fee before the hold expires.

Stack: .NET 10 Web API, EF Core, PostgreSQL, React (Vite), Docker.

## Run with Docker

Requires only Docker.

```bash
docker compose up --build
```

- Backend API: http://localhost:8080 (health check: `/health`)
- PostgreSQL: localhost:5432 (data is kept in the `pgdata` volume across `docker compose down` / `up`)

Optional overrides go in a `.env` file at the repository root (see `.env.example`): `DATABASE_URL`, `HOLD_DURATION_SECONDS`, `CORS_ORIGINS`.

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

## Tests

```bash
dotnet test backend/backend.slnx
```

Tests run against a real PostgreSQL. By default they start a throwaway container with Testcontainers (Docker must be running). To use an existing database instead, set `TEST_CONNECTION_STRING`. Use a dedicated database for this, because the tests empty the tables.

The concurrency tests send 50 parallel hold requests for 10 seats (and 40 requests through two app instances for 5 seats). They assert that exactly as many holds as seats succeed.

See `ASSUMPTIONS.md` for decisions the brief left open.
