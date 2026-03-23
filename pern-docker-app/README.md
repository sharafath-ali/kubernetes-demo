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

Behind the scenes, `docker-compose.yml` orchestrates three separate containers (`db`, `api`, and `frontend`) and connects them using core Docker concepts:

### 1. Volumes (Data Persistence)
- **What it is:** A volume is like a dedicated external hard drive for a container. By default, when a container is destroyed, all data inside it is lost. Volumes solve this by storing data safely on your host machine.
- **How it's used here:** We use a volume named `pgdata` to store the Postgres database files (`/var/lib/postgresql/data`). Even if you stop or remove the `db` container, your database records (tables, users) will survive. When you spin the container back up, Postgres reattaches to the volume and your data is exactly how you left it.
- **How to clean/reset it:** Since volumes persist data independently of containers, deleting the container won't wipe the database. To completely reset your database and wipe the volume, use the following Docker Compose command (the `-v` flag is crucial):
  ```bash
  docker-compose down -v
  ```

### 2. Networks (Internal Communication)
- **What it is:** A Docker network is a private, isolated virtual network that allows containers to talk to each other securely without exposing themselves to the outside world.
- **How it's used here:** We created a shared network called `pern-network`. Because all three containers (`db`, `api`, `frontend`) are on this same network, they can communicate using their container names as hostnames. 
  - For example, the backend API doesn't connect to `localhost:5432` to reach the database; it connects to `db:5432`. Docker's internal DNS automatically routes the traffic to the correct container.
- **What if you run them separately?:** If you skip `docker-compose` and try to run these containers individually (e.g., using explicit `docker run` commands), they will **not** share a common network by default. Instead, they will be placed on Docker's default bridge network and won't be able to resolve each other's names (like `db` or `api`). Docker Compose automatically provisions and connects them to `pern-network` so they can communicate perfectly.

### 3. Ports (External Access)
- **What it is:** Port mapping (or publishing) is how you open a "door" from your actual computer (the host) into the isolated container.
- **How it's used here:** Containers are mapped using the `HOST_PORT:CONTAINER_PORT` format.
  - **`5173:5173`:** Allows you to open `localhost:5173` in your web browser to view the React frontend.
  - **`5000:5000`:** Allows you to access the backend API at `localhost:5000` from your browser or Postman.
  - **`5432:5432`:** Allows database clients (like pgAdmin) installed on your computer to connect directly to the Postgres database for management.
