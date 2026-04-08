# Qwen AI Hackathon Monorepo

This repository contains two applications:

- Client: Next.js (App Router) using Bun
- Server: Django generated from Cookiecutter Django

## Project Structure

- client: Frontend app (Next.js)
- server: Backend app (Django + PostgreSQL via Docker Compose)

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
2. Build and start containers.

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

These files are already present in this repository. For your own deployment or shared environments, replace secrets and credentials with your own values.

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
