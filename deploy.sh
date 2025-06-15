#!/usr/bin/env bash
set -e

# ensure .env exists
if [ ! -f .env ]; then
  echo "ERROR: .env file missing. Copy .env.example → .env and update."
  exit 1
fi

echo "✅ Loading environment…"
export $(grep -v '^#' .env | xargs)

echo "🚧 Building images and deploying…"
docker compose pull || true
docker compose build --parallel
docker compose up -d

echo "🎉 Deployment complete!"
