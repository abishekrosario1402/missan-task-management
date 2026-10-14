FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip --disable-pip-version-check install --no-cache-dir --progress-bar off --retries 20 --timeout 600 -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
