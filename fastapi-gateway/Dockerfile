FROM python:3.11-slim
WORKDIR /app
COPY main.py .
RUN pip install fastapi uvicorn httpx python-jose
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000"]