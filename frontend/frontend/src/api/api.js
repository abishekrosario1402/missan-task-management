const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export const register = (email, password) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

export const getMe = (token) =>
  request("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getProjects = (token) =>
  request("/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createProject = (token, project) =>
  request("/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });

export const updateProject = (token, id, project) =>
  request(`/projects/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });

export const deleteProject = (token, id) =>
  request(`/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getTasks = (token, projectId, filters = {}) => {
  const params = new URLSearchParams();

  if (filters.status) {
    params.append("status", filters.status);
  }

  if (filters.priority) {
    params.append("priority", filters.priority);
  }

  const query = params.toString();

  return request(
    `/projects/${projectId}/tasks${query ? `?${query}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createTask = (token, projectId, task) =>
  request(`/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

export const updateTask = (token, taskId, task) =>
  request(`/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

export const deleteTask = (token, taskId) =>
  request(`/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });