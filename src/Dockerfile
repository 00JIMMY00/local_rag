FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# The source code will be mounted from the host machine
# so we don't need to copy it here

# Add a script to wait for the database
RUN echo '#!/bin/bash \n\
set -e \n\
\n\
host="$1" \n\
shift \n\
cmd="$@" \n\
\n\
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$host" -U "$POSTGRES_USERNAME" -d "$POSTGRES_MAIN_DATABASE" -c "\q"; do \n\
  >&2 echo "Postgres is unavailable - sleeping" \n\
  sleep 1 \n\
done \n\
\n\
>&2 echo "Postgres is up - executing command" \n\
exec $cmd' > /wait-for-postgres.sh

RUN chmod +x /wait-for-postgres.sh

# Create a script to run migrations and start the app
RUN echo '#!/bin/bash \n\
set -e \n\
\n\
# Navigate to the alembic directory \n\
cd /app/models/db_schemes/minirag \n\
\n\
# Run alembic migrations \n\
echo "Running database migrations..." \n\
alembic upgrade head \n\
\n\
# Return to app directory \n\
cd /app \n\
\n\
# Start the application \n\
echo "Starting the application..." \n\
exec uvicorn main:app --host 0.0.0.0 --port 5000 --reload' > /start.sh

RUN chmod +x /start.sh

# Expose port
EXPOSE 5000

# Command to run the application
CMD ["/wait-for-postgres.sh", "postgres", "/start.sh"] 