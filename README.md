# MISSAN Task Management System

A full-stack Task Management System built as a Full Stack Developer practical assessment.

The application allows users to register, login, create projects, manage tasks, update task status and priority, set due dates, and filter tasks.

## 🚀 Tech Stack

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic

### Frontend
- React
- React Hooks
- React Router
- Vite
- JavaScript
- CSS

### DevOps
- Docker
- Docker Compose

---

## ✨ Features

### Authentication
- User registration
- User login
- JWT authentication
- Current user profile
- Protected API endpoints

### Project Management
- Create project
- View projects
- View project details
- Edit project
- Delete project
- Cascade delete associated tasks

### Task Management
- Create task
- View tasks
- Edit task
- Delete task
- Update task status
- Set task priority
- Set task due date

### Task Status

- TODO
- IN_PROGRESS
- COMPLETED

### Task Priority

- LOW
- MEDIUM
- HIGH

### Task Filtering

Tasks can be filtered by:

- Status
- Priority
- Status + Priority

---

## 🏗️ Project Structure

```text
MISSAN/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   └── dependencies.py
│   │
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   └── frontend/
│       ├── src/
│       │   ├── api/
│       │   │   └── api.js
│       │   ├── pages/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── Dashboard.jsx
│       │   │   └── ProjectDetails.jsx
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── index.css
│       │
│       ├── Dockerfile
│       ├── package.json
│       └── vite.config.js
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
