FROM python:3.12-slim

WORKDIR /app

COPY . .

EXPOSE 8000

ENTRYPOINT ["python", "-m", "http.server", "8000", "--bind", "0.0.0.0"]