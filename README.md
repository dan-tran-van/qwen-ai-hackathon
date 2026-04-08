# Qwen AI Hackathon Monorepo

This repository contains two applications:

- Client: Next.js (App Router) using Bun
- Server: Django generated from Cookiecutter Django

## Project Structure

- client: Frontend app (Next.js)
- server: Backend app (Django + PostgreSQL via Docker Compose)

## Client Stack

The client uses a small set of UI and data-fetching libraries built around shadcn/ui:

- [shadcn/ui](https://ui.shadcn.com) for accessible, copyable UI components.
- [Recharts](https://recharts.org) for charting and data visualization components.
- [openapi-typescript](https://github.com/openapi-ts/openapi-typescript) to generate typed API definitions from the backend OpenAPI schema.
- [TanStack Query](https://tanstack.com/query/latest) for server-state management and request caching.
- [React Hook Form](https://react-hook-form.com) for form state and validation.

The client also uses `openapi-fetch` and `openapi-react-query` to connect the generated OpenAPI types to typed API calls and query helpers.

## Prerequisites

Install the following tools:

- Bun (latest stable)
- Docker Engine + Docker Compose plugin

Optional but recommended:

- just (for shortcut commands in server)

### Optional: Install `just` on WSL2 Ubuntu

If you are using WSL2 with Ubuntu, install `just` inside the Ubuntu environment so the backend shortcuts work:

    sudo apt update
    sudo apt install just

If your Ubuntu release does not provide the package, install `just` using the method recommended in the [official documentation](https://just.systems/man/en/).

## Quick Start (Recommended)

Run the Django server with Docker and the Next.js client with Bun.

### 1) Start the server

From the repository root:

1. Change into the server directory.
2. Copy the local Django env example file and add your Qwen API key.

   The backend uses the Alibaba Cloud Qwen API via the OpenAI-compatible Chat Completions interface. Follow the provider instructions at https://www.alibabacloud.com/help/en/model-studio/qwen-api-via-openai-chat-completions to obtain your key.

   Then copy `server/.envs/.local/.django.example` to `server/.envs/.local/.django` and set `DASHSCOPE_API_KEY` in the new file.

#### Google OAuth Setup (Backend)

Before running the backend with Google login enabled:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project.
3. Navigate to **APIs & Services -> Credentials**.
4. Click **Create Credentials -> OAuth 2.0 Client IDs**.
5. Configure the consent screen if prompted.
6. Select **Web application**.
7. Add authorized redirect URIs.
8. Development redirect URI: `http://localhost:3000/auth/google/callback`
9. Save your Client ID and Client Secret to `server/.envs/.local/.django` after copying it from `server/.envs/.local/.django.example`.

10. Build and start containers.

Commands:

    cd server
    docker compose -f docker-compose.local.yml up -d --build

Then run migrations:

    docker compose -f docker-compose.local.yml run --rm django python manage.py migrate

Create an admin user (optional):

    docker compose -f docker-compose.local.yml run --rm django python manage.py createsuperuser

Server URLs:

- App: http://localhost:8000
- Admin: http://localhost:8000/admin

### Access Swagger UI Docs

Swagger UI is restricted to admin users in this project.

1. Create a superuser:

   cd server
   docker compose -f docker-compose.local.yml run --rm django python manage.py createsuperuser

2. Login to the Django admin site at http://localhost:8000/admin.
3. Open the Swagger UI endpoint: http://localhost:8000/api/docs/.

### 2) Start the client

Open a second terminal, then:

    cd client
    bun install
    bun dev

Client URL:

- App: http://localhost:3000

## Server Local Environment Details

The local Docker setup reads environment files from:

- server/.envs/.local/.django
- server/.envs/.local/.postgres

The `.django` file is intentionally untracked, so create it by copying `server/.envs/.local/.django.example` to `server/.envs/.local/.django` before starting the backend. Add your Qwen API key there as `DASHSCOPE_API_KEY`.

For your own deployment or shared environments, replace secrets and credentials with your own values.

If you prefer just commands:

    cd server
    just build
    just up
    just manage migrate

Useful shortcuts:

- Start: just up
- Stop: just down
- Logs: just logs
- Django management commands: just manage <command>

## Client Local Environment Details

The client currently does not require a committed environment file to run locally.

Typical commands:

    cd client
    bun install
    bun dev
    bun run lint
    bun run build
    bun run schema:generate

The schema generation command keeps `client/lib/api/v1.d.ts` in sync with `server/schema.yml`.

## Collaboration Workflow

When working on a new client or full-stack feature:

1. Create a new branch before starting the feature work.
2. Pull the latest `main` branch frequently to avoid drift.
3. After pulling `main`, stop the local containers and rebuild the backend image before restarting the stack. Use `docker compose -f docker-compose.local.yml down` or `just down`, then `docker compose -f docker-compose.local.yml up -d --build` or `just build` followed by `just up`.
4. After pulling `main` or whenever the backend schema changes, re-run `bun run schema:generate` in `client/`.
5. Run the relevant checks before opening a pull request, typically `bun run lint` and `bun run build` in the client.

## Common Development Commands

Server:

    cd server
    just manage test

Client:

    cd client
    bun run lint
    bun run build

## Troubleshooting

- Port 8000 already in use:
  stop any existing process/container using port 8000, then restart server containers.
- Port 3000 already in use:
  stop the process on 3000 or run Next.js on another port.
- Database connection errors on server startup:
  ensure postgres container is running and migrations were applied.

## Notes

- Server stack: Cookiecutter Django conventions with Docker Compose for local development.
- Client stack: Next.js 16 + React 19, managed with Bun.
