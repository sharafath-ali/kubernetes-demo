# Port Binding Example — Python in Docker

Run a Python web server **inside Docker** and access it from your local browser using port binding.

## How to Run

From the repo root:
```bash
docker run --rm -p 8080:8080 -v "${PWD}:/app" -w /app python python -u port-binding-example/web_server.py
```

Then open your browser:
```
http://localhost:8080
```

> Press `Ctrl+C` to stop the server.

## Command Explained

```bash
docker run --rm -p 8080:8080 -v "${PWD}:/app" -w /app python python -u port-binding-example/web_server.py
```

### `docker run`
Starts a new Docker container from an image.

---

### `--rm`
**Auto-remove** the container when it stops.
Without this, stopped containers pile up and take disk space.
```bash
# Without --rm, you'd need to clean up manually:
docker rm <container_id>
```

---

### `-p 8080:8080`
**Port binding** — connects your local machine to the container.
```
localhost:8080  →  container:8080
```
- Left side `8080` = port on **your machine**
- Right side `8080` = port inside the **container**

You can use different ports, e.g. `-p 9090:8080` to open `localhost:9090`.

---

### `-v "${PWD}:/app"`
**Volume mount** — shares your local folder with the container.
```
Your machine: C:\Users\...\kubernetes-demo  →  Container: /app
```
- `${PWD}` = your current working directory
- `/app` = the path inside the container where files appear
- Any file changes on your machine are instantly visible inside the container.

---

### `-w /app`
**Working directory** inside the container.
All commands run from `/app` by default (where your files are mounted).

---

### `python`
The **Docker image** to use — pulls the official Python image from Docker Hub.

---

### `python -u`
Runs Python with **unbuffered output** (`-u` flag).
Without `-u`, Docker holds print output in a buffer and only shows it when the container exits.
With `-u`, logs appear **immediately** in your terminal.

---

### `port-binding-example/web_server.py`
The Python script to run inside the container.

---

## How It All Connects

```
Your Browser
     │
     │  http://localhost:8080
     ▼
 Your Machine  ──(-p 8080:8080)──▶  Docker Container
                                          │
                              (-v mounts your files)
                                          │
                                    /app/web_server.py
                                    (Python HTTP Server)
```

## Files

- `web_server.py` — Python HTTP server using the built-in `http.server` module (no extra installs needed)
