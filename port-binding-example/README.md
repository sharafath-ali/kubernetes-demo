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

## How Port Binding Works

```
Your Browser (localhost:8080)  →  -p 8080:8080  →  Container (port 8080)
```

| Flag | Description |
|------|-------------|
| `-p 8080:8080` | Maps `localhost:8080` → container port `8080` |
| `-p <local>:<container>` | General format — change ports as needed |

## Files

- `web_server.py` — Python HTTP server using the built-in `http.server` module (no extra installs needed)
