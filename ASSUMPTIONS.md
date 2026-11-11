# Assumptions

## Identity
- The student is identified only by the `X-Student-Id` header. It must be exactly 17 digits (birth registration number); anything else returns `400 INVALID_STUDENT_ID`.
- There is no login and no student table. Admin actions (creating classes) are not protected, as the brief says no login is needed.

## Classes
- Each shift is its own class, e.g. "Class 6 - Morning Shift".
- Class names must follow the format `Class <1-10> - <Morning|Day> Shift`, checked with this regex (case-insensitive):
  `^Class\s+([1-9]|10)\s*[-–—]\s*(Morning|Day)\s+Shift$`
  - Hyphen, en dash and em dash are all accepted, so the brief's own example `Class 6 – Morning Shift` is valid.
  - Anything else (e.g. `67`, `Class 11 - Morning Shift`, `Class 6 - Evening Shift`) returns `400 INVALID_REQUEST`.
  - The name is stored as sent (trimmed), not rewritten to one canonical spelling.
  - Reason: the school only runs Class 1-10 in two shifts. The admin UI builds the name from two dropdowns filled by `GET /class-options`, and the regex stops free-text names sent directly to the API.
  - Trade-off: a name outside this format (e.g. a third shift) is rejected. Supporting one later means changing the regex and the `/class-options` lists together.
- `GET /class-options` is an extra endpoint (not in the brief) that returns `{ "grades": [...], "shifts": [...] }` for the admin form. It does not change any endpoint from the brief.
- Class names are unique (`409 CLASS_NAME_TAKEN` on duplicates). Total seats must be between 1 and 10,000.
- IDs are UUIDs (the brief allows any format).

## Holds
- `GET /holds/{holdId}` does not require the header (the brief does not list one); confirm, cancel and `/me/holds` do.
- Statuses: `HELD`, `CONFIRMED`, `EXPIRED`, `CANCELLED`.
- Expiry is based on time, not on a job: a `HELD` hold whose `expiresAt` has passed is reported as `EXPIRED` and stops counting toward `heldSeats` at that exact moment. A background worker also writes `EXPIRED` to the row every 30 seconds, only for tidy data; correctness never depends on it.
- `expiresAt` is UTC, truncated to whole seconds.
- One active (`HELD` or `CONFIRMED`) hold per student per class. After a hold expires or is cancelled, the student can apply again if seats are left.
- Confirm:
  - Only the owner can confirm (`403 NOT_YOUR_HOLD` otherwise).
  - Confirming an already confirmed hold returns `200` again and does not count the seat twice.
  - Confirming an expired or cancelled hold returns `409 HOLD_EXPIRED` / `409 HOLD_CANCELLED`.
- Cancel (`DELETE`):
  - Only the owner can cancel, and only while the hold is `HELD`.
  - Cancelling a confirmed admission returns `409 HOLD_ALREADY_CONFIRMED` (refunds are out of scope).
  - Cancelling an already cancelled hold returns `204` again.
- Unknown IDs return `404`.

## Seat counting and concurrency
- `heldSeats` and `confirmedSeats` are not stored; they are counted from the `hold` table (`HELD` and not expired, `CONFIRMED`). So they can never drift out of sync.
- Creating a hold runs in one transaction that first locks the class row with `SELECT ... FOR UPDATE`. All hold requests for the same class wait for each other in PostgreSQL, so `held + confirmed` can never exceed `totalSeats`.
- Because the lock lives in the database, this also holds with two backend processes on different ports sharing one database (bonus). A test runs two app instances against one database to check it.
- A partial unique index on `hold (class_id, student_id) WHERE status IN ('HELD','CONFIRMED')` is a database-level backstop for the one-active-hold rule.
- Confirm and cancel are single conditional `UPDATE` statements (`... WHERE status = 'HELD' AND expires_at > now`), so two simultaneous confirms cannot both change the row.

## Errors
- Errors use RFC 7807 problem details with an extra `code` field and a human-readable `detail` that the UI can show directly.

## Configuration
- `ConnectionStrings__Default` (or `DATABASE_URL`): accepts both `Host=...;` and `postgresql://...` URLs (e.g. Neon).
- `HOLD_DURATION_SECONDS`: default 600.
- `CORS_ORIGINS`: comma-separated frontend origins.

## UI
- The birth registration number entered at the top of the page is stored in the browser's localStorage and sent as `X-Student-Id` on every request. That is how a student sees their applications again after a refresh or reopening the browser. Anyone who knows a number can act for that student; this follows from the brief having no login.
- Create class uses two dropdowns (class 1–10 and Morning/Day shift from `GET /class-options`) and builds the name `Class N – X Shift`, so names always match the format the backend accepts.
- Seat counts poll every 3 seconds; an open application and My applications poll every 5 seconds.
- The countdown runs on the browser clock against `expiresAt`. When it reaches zero the UI shows EXPIRED and disables Pay straight away, then refetches. The server stays the source of truth: paying after expiry is still rejected with `409 HOLD_EXPIRED`, and a badly wrong client clock only affects the display until the next poll.
- Every API error is shown as a readable message (the backend `detail`). If the server cannot be reached, the UI says so instead of showing a blank page. Lists longer than 20 items are paginated.
