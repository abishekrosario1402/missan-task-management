from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def get_unique_email():
    return f"pytest_{uuid4().hex}@example.com"


def test_root():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == "Task Management API is running"


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_register_and_login():
    email = get_unique_email()
    password = "Test@12345"

    # Register
    register = client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password
        }
    )

    assert register.status_code == 201

    # Login
    login = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password
        }
    )

    assert login.status_code == 200

    data = login.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_project_crud():
    email = get_unique_email()
    password = "Test@12345"

    # Register
    register = client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password
        }
    )

    assert register.status_code == 201

    # Login
    login = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password
        }
    )

    assert login.status_code == 200

    token = login.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create project
    create = client.post(
        "/projects",
        json={
            "title": "Pytest Project",
            "description": "Project CRUD test"
        },
        headers=headers
    )

    assert create.status_code == 201

    project = create.json()

    project_id = project["id"]

    assert project["title"] == "Pytest Project"

    # Get project
    get_project = client.get(
        f"/projects/{project_id}",
        headers=headers
    )

    assert get_project.status_code == 200
    assert get_project.json()["id"] == project_id

    # Update project
    update = client.put(
        f"/projects/{project_id}",
        json={
            "title": "Updated Pytest Project",
            "description": "Updated description"
        },
        headers=headers
    )

    assert update.status_code == 200
    assert update.json()["title"] == "Updated Pytest Project"

    # Delete project
    delete = client.delete(
        f"/projects/{project_id}",
        headers=headers
    )

    assert delete.status_code == 200

    # Verify deleted
    get_deleted = client.get(
        f"/projects/{project_id}",
        headers=headers
    )

    assert get_deleted.status_code == 404

def test_task_crud():
    email = get_unique_email()
    password = "Test@12345"

    # Register
    register = client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password
        }
    )

    assert register.status_code == 201

    # Login
    login = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password
        }
    )

    assert login.status_code == 200

    token = login.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create project
    project_response = client.post(
        "/projects",
        json={
            "title": "Task Test Project",
            "description": "Testing task CRUD"
        },
        headers=headers
    )

    assert project_response.status_code == 201

    project_id = project_response.json()["id"]

    # Create task
    task_response = client.post(
        f"/projects/{project_id}/tasks",
        json={
            "title": "Test Task",
            "description": "Task CRUD test"
        },
        headers=headers
    )

    assert task_response.status_code == 201

    task = task_response.json()
    task_id = task["id"]

    assert task["title"] == "Test Task"
    assert task["status"] == "TODO"
    assert task["project_id"] == project_id

    # Get task
    get_task = client.get(
        f"/tasks/{task_id}",
        headers=headers
    )

    assert get_task.status_code == 200
    assert get_task.json()["id"] == task_id

    # Get project tasks
    get_tasks = client.get(
        f"/projects/{project_id}/tasks",
        headers=headers
    )

    assert get_tasks.status_code == 200
    assert len(get_tasks.json()) >= 1

    # Update task
    update = client.put(
        f"/tasks/{task_id}",
        json={
            "title": "Updated Test Task",
            "description": "Updated task",
            "status": "IN_PROGRESS"
        },
        headers=headers
    )

    assert update.status_code == 200

    updated_task = update.json()

    assert updated_task["title"] == "Updated Test Task"
    assert updated_task["status"] == "IN_PROGRESS"

    # Delete task
    delete = client.delete(
        f"/tasks/{task_id}",
        headers=headers
    )

    assert delete.status_code == 200

    # Verify deleted
    get_deleted = client.get(
        f"/tasks/{task_id}",
        headers=headers
    )

    assert get_deleted.status_code == 404