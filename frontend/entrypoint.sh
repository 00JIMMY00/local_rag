#!/bin/sh
# This script is executed when the container starts.

# Generate config.js from environment variables
cat > /app/dist/config.js << EOF
window.env = {
  VITE_API_URL: "${VITE_API_URL:-http://173.212.254.228:5000}",
  VITE_API_BASE_PATH: "${VITE_API_BASE_PATH:-/api/v1}",
  VITE_FRONTEND_URL: "${VITE_FRONTEND_URL:-https://ragglocal.coderaai.com}"
};
EOF

# Start the server
exec serve -s /app/dist -l 3001 --single 