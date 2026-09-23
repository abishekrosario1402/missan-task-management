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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadProject();
  }, []);

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
        projectId
      );

      setTasks(projectTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        }
      );

      setTasks((current) => [
        ...current,
        newTask,
      ]);

      setTitle("");
      setDescription("");
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

        {/* TASK LIST */}

        <section className="projects-section">

          <div className="section-title">

            <h2>Tasks</h2>

            <span>
              {tasks.length} Tasks
            </span>

          </div>

          {tasks.length === 0 ? (

            <div className="empty-state">

              <h3>No tasks yet</h3>

              <p>
                Create your first task above.
              </p>

            </div>

          ) : (

            <div className="project-grid">

              {tasks.map((task) => (

                <div
                  className="project-card"
                  key={task.id}
                >

                  <h3>
                    {task.title}
                  </h3>

                  <p>
                    {task.description ||
                      "No description"}
                  </p>

                  {/* STATUS */}

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
                              TODO
                          </option>

                          <option value="IN_PROGRESS">
                              In Progress
                          </option>

                          <option value="COMPLETED">
                              Completed
                          </option>
                      </select>
                  <div className="project-actions">

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteTask(
                          task.id
                        )
                      }
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

    </div>
  );
}

export default ProjectDetails;