import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMe,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [editProjectId, setEditProjectId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [userData, projectData] = await Promise.all([
        getMe(token),
        getProjects(token),
      ]);

      setUser(userData);
      setProjects(projectData);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setEditProjectId(project.id);
    setEditTitle(project.title);
    setEditDescription(project.description || "");
  };

  const handleCreateProject = async () => {
    setError("");

    if (!title.trim()) {
      setError("Project title is required");
      return;
    }

    try {
      const newProject = await createProject(token, {
        title,
        description,
      });

      setProjects((current) => [...current, newProject]);

      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProject = async () => {
    setError("");

    if (!editTitle.trim()) {
      setError("Project title is required");
      return;
    }

    try {
      const updatedProject = await updateProject(
        token,
        editProjectId,
        {
          title: editTitle,
          description: editDescription,
        }
      );

      setProjects((current) =>
        current.map((project) =>
          project.id === editProjectId
            ? updatedProject
            : project
        )
      );

      setEditProjectId(null);
      setEditTitle("");
      setEditDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(token, id);

      setProjects((current) =>
        current.filter((project) => project.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">

      {/* HEADER */}

      <header className="dashboard-header">
        <div>
          <h1>Task Management</h1>
          <p>Manage your projects and tasks</p>
        </div>

        <div className="header-right">
          {user && <span>{user.email}</span>}

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}

      <main className="dashboard-content">

        {/* CREATE PROJECT */}

        <section className="project-form">

          <h2>Create Project</h2>

          <input
            type="text"
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button onClick={handleCreateProject}>
            + Create Project
          </button>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

        </section>

        {/* PROJECT LIST */}

        <section className="projects-section">

          <div className="section-title">
            <h2>Your Projects</h2>
            <span>{projects.length} Projects</span>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects yet</h3>
              <p>Create your first project above.</p>
            </div>
          ) : (
            <div className="project-grid">

              {projects.map((project) => (

                <div
                  className="project-card"
                  key={project.id}
                >

                  <h3>{project.title}</h3>

                  <p>
                    {project.description ||
                      "No description"}
                  </p>

                  <div className="project-actions">
                    <button
                      className="open-button"
                      onClick={() =>
                        navigate(`/projects/${project.id}`)
                      }
                    >
                      Open
                    </button>

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEditProject(project)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteProject(project.id)
                      }
                    >
                      Delete
                    </button>
                  </div>

                  {editProjectId && (
                    <div className="modal-overlay">
                      <div className="edit-modal">
                        <div className="edit-modal-header">
                          <div>
                            <h2>Edit Project</h2>
                            <p>Update your project details</p>
                          </div>

                          <button
                            className="modal-close"
                            onClick={() => {
                              setEditProjectId(null);
                              setEditTitle("");
                              setEditDescription("");
                            }}
                          >
                            ×
                          </button>
                        </div>

                        <div className="edit-modal-body">
                          <label>Project Title</label>

                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) =>
                              setEditTitle(e.target.value)
                            }
                            placeholder="Project title"
                          />

                          <label>Project Description</label>

                          <textarea
                            value={editDescription}
                            onChange={(e) =>
                              setEditDescription(e.target.value)
                            }
                            placeholder="Project description"
                            rows="5"
                          />
                        </div>

                        <div className="edit-modal-actions">
                          <button
                            className="cancel-button"
                            onClick={() => {
                              setEditProjectId(null);
                              setEditTitle("");
                              setEditDescription("");
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            className="save-button"
                            onClick={handleUpdateProject}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Dashboard;