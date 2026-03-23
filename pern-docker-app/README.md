# PERN Docker App

This directory contains a complete containerized PERN (Postgres, Express, React, Node) stack.

- **`docker-compose.yml`**: Spins up the database, backend, and frontend.
- **`backend/`**: Node.js REST API connecting to the Postgres database.
- **`frontend/`**: Vite React app fetching from the backend API.

## Getting Started

1. Ensure Docker Desktop is running.
2. Open your terminal in this directory (`kubernetes-demo/pern-docker-app`).
3. Run the following command:
   ```bash
   docker-compose up --build -d
   ```
4. Test it out!
   - Frontend React App: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## Checking the Database

You can connect to and check the PostgreSQL database using any database client (such as pgAdmin, DBeaver, or a VS Code extension). Use the following connection details:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `pern_database`
- **Username**: `pern_user`
- **Password**: `pern_password`

## How it works
Both the `api` and `frontend` have their own `Dockerfile`s. `docker-compose.yml` builds these images locally and wires them together with the official Postgres image on a shared Docker network (`pern-network`) so they can communicate seamlessly!
