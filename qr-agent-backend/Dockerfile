FROM python:3.13-slim

WORKDIR /app

# Install dependencies for psycopg2
RUN apt-get update && \
    apt-get install -y \
        build-essential \
        libpq-dev \
        gcc \
        python3-dev

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copy project
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--worker-class", "geventwebsocket.gunicorn.workers.GeventWebSocketWorker", "--workers", "4", "app:app"]