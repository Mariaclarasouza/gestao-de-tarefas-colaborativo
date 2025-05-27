import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ProjectCards.css";

export default function ProjectCards({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [openedProjectId, setOpenedProjectId] = useState(null);

  useEffect(() => {
    if (user?.token) fetchProjects();
  }, [user]);

  const fetchProjects = () => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:3001/projects", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erro ao carregar projetos.");
        setLoading(false);
        console.error(err);
      });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description) return;

    setCreating(true);
    try {
      await axios.post(
        "http://localhost:3001/projects",
        {
          ...newProject,
          entityId: user.entityId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setNewProject({ name: "", description: "" });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      alert("Erro ao criar projeto.");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p className="loading">Carregando projetos...</p>;
  if (error) return <p className="error">{error}</p>;
  if (projects.length === 0 && !showForm)
    return (
      <div className="no-projects">
        <p>Nenhum projeto encontrado.</p>
        {user?.role === "admin" && (
          <button onClick={() => setShowForm(true)}>Criar Projeto</button>
        )}
      </div>
    );

  return (
    <div className="project-cards-container">
      {user?.role === "admin" && (
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="create-btn"
        >
          {showForm ? "Cancelar" : "Criar Projeto"}
        </button>
      )}

      {showForm && user?.role === "admin" && (
        <form onSubmit={handleCreate} className="project-form">
          <input
            type="text"
            placeholder="Nome do projeto"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Descrição do projeto"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            required
          />
          <button type="submit" disabled={creating}>
            {creating ? "Criando..." : "Salvar"}
          </button>
        </form>
      )}

      {projects.map((project) => (
        <div
          key={project.id}
          className="project-card"
          onClick={() => toggleOpenProject(project.id)}
          style={{ cursor: "pointer" }}
        >
          <h3>{project.title}</h3>
          {openedProjectId === project.id ? (
            <>
              <p>{project.description}</p>
              <TaskList boardId={project.id} user={user} />
            </>
          ) : (
            <p>{project.description?.substring(0, 100)}...</p>
          )}
        </div>
      ))}
    </div>
  );
}
