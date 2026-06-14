#!/usr/bin/env sh
# E2E gateway launcher. The backend gateway now requires Postgres (it auto-runs
# migrations + seeds on startup), so this provisions a throwaway, freshly-seeded
# Postgres in Docker and execs the gateway against it. Used by playwright.config's
# webServer. Infra only — it does not touch backend code.
set -e

NAME="library-e2e-pg"
PG_PORT="55432"
BACKEND="../library-backend"

# Fresh database each run → deterministic seed, no stale loans/users.
docker rm -f "$NAME" >/dev/null 2>&1 || true
docker run -d --name "$NAME" \
	-e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres \
	-p "$PG_PORT:5432" postgres:16 >/dev/null

# Wait until Postgres truly accepts queries (the init bootstrap restarts once).
i=0
while [ "$i" -lt 60 ]; do
	if docker exec "$NAME" pg_isready -U postgres >/dev/null 2>&1; then
		sleep 1
		if docker exec "$NAME" psql -U postgres -d postgres -tAc 'select 1' >/dev/null 2>&1; then
			break
		fi
	fi
	i=$((i + 1))
	sleep 1
done

cd "$BACKEND"
[ -x target/debug/gateway ] || cargo build -p gateway
DATABASE_URL="postgres://postgres:postgres@localhost:$PG_PORT/postgres" exec target/debug/gateway
