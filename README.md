# EcoLog — Local Development

This README explains how to run EcoLog locally and how the `Start` button on the landing page works.

## Quick start (macOS, zsh)

1. Install Node (recommended: v20) via nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
```

2. Install dependencies:

```bash
npm ci
```

3. Copy `.env.example` to `.env` and edit values (DATABASE_URL, SESSION_SECRET):

```bash
cp .env.example .env
# edit .env
```

4. Optional: start Postgres via Docker (example):

```bash
docker run --name elog-postgres -e POSTGRES_USER=eco_user -e POSTGRES_PASSWORD=eco_pass -e POSTGRES_DB=eco_db -p 5432:5432 -d postgres:16
# or
# docker-compose up -d
```

5. Run dev (client + server):

```bash
npm run dev
```

6. Open the app in the browser: Vite usually serves the client at `http://localhost:5173` and the server runs on port `3000`.

## "Start" button behavior

- Landing page buttons now navigate to `/signup`.
- `/signup` offers a "Start as Guest" button which calls `POST /api/auth/guest`.
- The server creates a lightweight guest user, upserts it into the `users` table, and establishes a session. After success, the client navigates to `/dashboard`.

This flow allows trying out the app locally without OIDC setup.

## Converting guest accounts to full accounts

Guest accounts are created with a `guest:`-prefixed id and can be converted later by implementing a flow to link guest id to OIDC-provided sub during login.

## Troubleshooting

See the project `Troubleshooting` section in the main developer docs or open an issue if you run into problems.
