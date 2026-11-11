# AI Usage

## Tool
- Claude Code (Claude Opus 5.5)

## Where it was used
- Database schema decisions
- Folder and project structure decisions
- Writing the implementation code

## Human oversight
- Every endpoint tested manually, including error cases (no seats, duplicate application, expired, other student's hold)
- Full app checked end to end through the UI with `docker compose up`
- Code reviewed for structure, patterns and coding style before each pull request
- Schema, folder structure and design decisions reviewed and approved before implementation
- Bugs found during manual testing were fixed and covered with tests

