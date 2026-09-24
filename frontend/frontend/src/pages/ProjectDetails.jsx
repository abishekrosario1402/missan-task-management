import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProjects,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/api";

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
const [editTaskTitle, setEditTaskTitle] = useState("");
const [editTaskDescription, setEditTaskDescription] = useState("");
const [editTaskStatus, setEditTaskStatus] = useState("TODO");
const [editTaskPriority, setEditTaskPriority] = useState("MEDIUM");
const [editTaskDueDate, setEditTaskDueDate] = useState("");

  useEffect(() => {
    if (!token) return;

    loadTasks();
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadProject();
  }, []);

  const handleEditTask = (task) => {
  setEditingTaskId(task.id);
  setEditTaskTitle(task.title);
  setEditTaskDescription(task.description || "");
  setEditTaskStatus(task.status || "TODO");
  setEditTaskPriority(task.priority || "MEDIUM");

  setEditTaskDueDate(
    task.due_date
      ? new Date(task.due_date)
          .toISOString()
          .split("T")[0]
      : ""
  );
};

const handleUpdateTask = async () => {
  setError("");

  if (!editTaskTitle.trim()) {
    setError("Task title is required");
    return;
  }

  try {
    const updatedTask = await updateTask(
      token,
      editingTaskId,
      {
        title: editTaskTitle,
        description: editTaskDescription,
        status: editTaskStatus,
        priority: editTaskPriority,
        due_date: editTaskDueDate
          ? `${editTaskDueDate}T00:00:00`
          : null,
      }
    );

    setTasks((current) =>
      current.map((task) =>
        task.id === editingTaskId
          ? updatedTask
          : task
      )
    );

    setEditingTaskId(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
    setEditTaskStatus("TODO");
    setEditTaskPriority("MEDIUM");
    setEditTaskDueDate("");
  } catch (err) {
    setError(err.message);
  }
};

  const loadProject = async () => {
    try {
      const projects = await getProjects(token);

      const selectedProject = projects.find(
        (item) => item.id === Number(projectId)
      );

      if (!selectedProject) {
        navigate("/dashboard");
        return;
      }

      setProject(selectedProject);

      const projectTasks = await getTasks(
        token,
        projectId,
        {
          status: statusFilter,
          priority: priorityFilter,
        }
      );

      setTasks(projectTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const projectTasks = await getTasks(
        token,
        projectId,
        {
          status: statusFilter,
          priority: priorityFilter,
        }
      );

      setTasks(projectTasks);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateTask = async () => {
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      const newTask = await createTask(
        token,
        projectId,
        {
          title,
          description,
          priority,
          due_date: dueDate
            ? `${dueDate}T00:00:00`
            : null,
        }
      );

      setTasks((current) => [
        ...current,
        newTask,
      ]);

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (
    taskId,
    status
  ) => {
    try {
      const updatedTask = await updateTask(
        token,
        taskId,
        { status }
      );

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? updatedTask
            : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(token, taskId);

      setTasks((current) =>
        current.filter(
          (task) => task.id !== taskId
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading project...
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div>
          <h1>{project?.title}</h1>

          <p>
            {project?.description ||
              "Project tasks"}
          </p>
        </div>

        <button
          className="logout-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard
        </button>

      </header>

      {/* CONTENT */}

      <main className="dashboard-content">

        {/* CREATE TASK */}

        <section className="project-form">

          <h2>Create Task</h2>

          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button onClick={handleCreateTask}>
            + Create Task
          </button>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

        </section>

        <div className="task-form-row">
          <div className="form-field">
            <label>Priority</label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="form-field">
            <label>Due Date</label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
            />
          </div>
        </div>

        {/* TASK LIST */}

        <section className="projects-section">
          <div className="section-title">
            <h2>Tasks</h2>
            <span>{tasks.length} Tasks</span>
          </div>

          <div className="task-filters">
  <div className="filter-field">
    <label>Status</label>

    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
    >
      <option value="">All Statuses</option>
      <option value="TODO">Pending</option>
      <option value="IN_PROGRESS">
        In Progress
      </option>
      <option value="COMPLETED">
        Completed
      </option>
    </select>
  </div>

  <div className="filter-field">
    <label>Priority</label>

    <select
      value={priorityFilter}
      onChange={(e) =>
        setPriorityFilter(e.target.value)
      }
    >
      <option value="">All Priorities</option>
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
    </select>
  </div>

  {(statusFilter || priorityFilter) && (
    <button
      className="clear-filter-button"
      onClick={() => {
        setStatusFilter("");
        setPriorityFilter("");
      }}
    >
      Clear Filters
    </button>
  )}
</div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks yet</h3>
              <p>Create your first task above.</p>
            </div>
          ) : (
            <div className="project-grid">
              {tasks.map((task) => (
                <div className="task-card" key={task.id}>
                  <div className="task-card-header">
                    <h3>{task.title}</h3>

                    <span
                      className={`task-status status-${task.status.toLowerCase()}`}
                    >
                      {task.status === "TODO" && "Pending"}
                      {task.status === "IN_PROGRESS" && "In Progress"}
                      {task.status === "COMPLETED" && "Completed"}
                    </span>
                  </div>

                  <p>
                    {task.description || "No description"}
                  </p>

                  <div className="task-meta">
                    <span
                      className={`priority-badge priority-${task.priority?.toLowerCase()}`}
                    >
                      {task.priority || "MEDIUM"}
                    </span>

                    <span className="due-date">
                      📅{" "}
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : "No due date"}
                    </span>
                  </div>

                  <div className="task-status-control">
                    <label>Status</label>

                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(
                          task.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="TODO">
                        Pending
                      </option>

                      <option value="IN_PROGRESS">
                        In Progress
                      </option>

                      <option value="COMPLETED">
                        Completed
                      </option>
                    </select>
                  </div>

<div className="task-actions">
  <button
    className="edit-button"
    onClick={() => handleEditTask(task)}
  >
    Edit
  </button>

  <button
    className="delete-button"
    onClick={() => handleDeleteTask(task.id)}
  >
    Delete
  </button>
</div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
{editingTaskId && (
  <div className="modal-overlay">
    <div className="edit-modal">
      <div className="edit-modal-header">
        <div>
          <h2>Edit Task</h2>
          <p>Update your task details</p>
        </div>

        <button
          className="modal-close"
          onClick={() => setEditingTaskId(null)}
        >
          ×
        </button>
      </div>

      <div className="edit-modal-body">
        <label>Task Title</label>

        <input
          type="text"
          value={editTaskTitle}
          onChange={(e) =>
            setEditTaskTitle(e.target.value)
          }
          placeholder="Task title"
        />

        <label>Description</label>

        <textarea
          value={editTaskDescription}
          onChange={(e) =>
            setEditTaskDescription(e.target.value)
          }
          placeholder="Task description"
          rows="4"
        />

        <div className="task-form-row">
          <div className="form-field">
            <label>Status</label>

            <select
              value={editTaskStatus}
              onChange={(e) =>
                setEditTaskStatus(e.target.value)
              }
            >
              <option value="TODO">Pending</option>
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="COMPLETED">
                Completed
              </option>
            </select>
          </div>

          <div className="form-field">
            <label>Priority</label>

            <select
              value={editTaskPriority}
              onChange={(e) =>
                setEditTaskPriority(e.target.value)
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div className="form-field">
          <label>Due Date</label>

          <input
            type="date"
            value={editTaskDueDate}
            onChange={(e) =>
              setEditTaskDueDate(e.target.value)
            }
          />
        </div>
      </div>

      <div className="edit-modal-actions">
        <button
          className="cancel-button"
          onClick={() => setEditingTaskId(null)}
        >
          Cancel
        </button>

        <button
          className="save-button"
          onClick={handleUpdateTask}
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default ProjectDetails;