FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Set environment
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Run app with gunicorn (production-ready)
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]
