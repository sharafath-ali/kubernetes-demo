# Run Python with Docker

Run Python scripts **without installing Python** — using Docker instead.

## Prerequisites

- [Docker](https://www.docker.com/) installed and running
- Python Docker image pulled: `docker pull python`

## How to Run

```bash
docker run --rm -v "${PWD}:/app" -w /app python python run-python-in-docker-container/hello.py
```

## What It Does

| Flag | Description |
|------|-------------|
| `docker run` | Runs a Docker container |
| `--rm` | Auto-removes the container after it exits |
| `-v "${PWD}:/app"` | Mounts your current folder into the container |
| `-w /app` | Sets the working directory inside the container |
| `python` | Uses the official Python Docker image |
| `python run-python-in-docker-container/hello.py` | Runs the script inside the container |

## Files

- `hello.py` — Sample Python script demonstrating basic Python features
