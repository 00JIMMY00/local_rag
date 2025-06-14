# Docker Compose Setup for Mini-RAG

This Docker Compose configuration sets up a complete Mini-RAG environment with:
- Frontend service (React)
- Backend service (FastAPI)
- PostgreSQL database with pgvector extension

## Prerequisites

- Docker and Docker Compose installed on your system
- Source code for Mini-RAG in `/home/jimmy/Grad/local_rag/`

## Directory Structure

The Docker Compose setup expects the following directory structure:
```
/home/jimmy/Grad/local_rag/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   └── ... (frontend code)
├── src/
│   ├── Dockerfile
│   └── ... (backend code)
```

## Configuration

The Docker Compose setup uses the following ports:
- Frontend: 3001
- Backend: 5000
- PostgreSQL: 5432

## Usage

### Starting the Services

To start all services:

```bash
cd /home/jimmy/Grad/local_rag/
docker-compose up -d
```

To start only specific services:

```bash
docker-compose up -d frontend backend
```

### Stopping the Services

To stop all services:

```bash
docker-compose down
```

To stop and remove volumes (this will delete the database data):

```bash
docker-compose down -v
```

### Viewing Logs

To view logs from all services:

```bash
docker-compose logs -f
```

To view logs from a specific service:

```bash
docker-compose logs -f backend
```

### Rebuilding Services

If you make changes to the Dockerfiles:

```bash
docker-compose build
docker-compose up -d
```

## Development Workflow

The source code directories are mounted into the containers, so any changes you make to the source code will be reflected in the running containers:

1. Edit files in `/home/jimmy/Grad/local_rag/frontend/` or `/home/jimmy/Grad/local_rag/src/`
2. The changes will be automatically detected:
   - Frontend: Vite will automatically reload
   - Backend: Uvicorn will automatically reload with the `--reload` flag

## Accessing the Services

- Frontend: http://173.212.254.228:3001
- Backend API: http://173.212.254.228:5000

## Notes

- The PostgreSQL data is persisted in a Docker volume named `postgres-data`
- The frontend's node_modules directory is not mounted from the host to avoid conflicts
- Both services are configured to restart automatically unless explicitly stopped 