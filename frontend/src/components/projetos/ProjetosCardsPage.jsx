import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskList from "../tarefa/CardTarefa";
import PaymentModule from "../PaymentModule";

export default function ProjectCards({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [openedProjectId, setOpenedProjectId] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
        { ...newProject, entityId: user.entityId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNewProject({ name: "", description: "" });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      if (
        err.response?.status === 403 &&
        err.response.data?.needUpgrade === true
      ) {
        setShowUpgradeModal(true);
      } else {
        alert("Erro ao criar projeto.");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleUpgradeToPremium = () => {
    alert("Fluxo de upgrade para usuário premium iniciado!");
    setShowUpgradeModal(false);
  };

  if (loading) return <p className="loading">Carregando projetos...</p>;
  if (error) return <p className="error">{error}</p>;

  const toggleOpenProject = (id) => {
    setOpenedProjectId((prevId) => (prevId === id ? null : id));
  };
  return (
    <div className="project-cards-container">
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

      {projects.length === 0 && (
        <p className="no-projects-message">Nenhum projeto encontrado.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1.5rem",
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => toggleOpenProject(project.id)}
            style={{
              cursor: "pointer",
              gridColumn: openedProjectId === project.id ? "span 2" : "auto",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              minHeight: "220px",
              minWidth: "300px",
            }}
          >
            <h3>{project.title}</h3>
            {openedProjectId === project.id ? (
              <>
                <p>{project.description}</p>
                <TaskList boardId={project.id} user={user} />
                <p>ID do projeto: {project.id}</p>
              </>
            ) : (
              <p>{project.description?.substring(0, 100)}...</p>
            )}
          </div>
        ))}
      </div>

      {user?.role === "admin" && (
        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="create-btn"
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            {showForm ? "Cancelar" : "Criar Projeto"}
          </button>
        </div>
      )}

      {showUpgradeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              maxWidth: "550px",
              textAlign: "center",
            }}
          >
            <h3>Upgrade para Premium</h3>
            {!showPaymentForm ? (
              <>
                <p>
                  Você atingiu o limite de 5 projetos. Deseja virar usuário
                  premium para criar mais projetos?
                </p>
                <button onClick={() => setShowPaymentForm(true)}>
                  Sim, quero ser Premium
                </button>
                <br />
                <button
                  style={{ marginTop: "1rem" }}
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <PaymentModule
                  onPaymentSuccess={async () => {
                    try {
                      await axios.post(
                        "http://localhost:3001/users/upgrade-to-premium",
                        {},
                        { headers: { Authorization: `Bearer ${user.token}` } }
                      );
                      alert("Você agora é um usuário premium!");
                      setShowUpgradeModal(false);
                      setShowPaymentForm(false);
                      fetchProjects();
                    } catch (error) {
                      console.error(error);
                      alert("Erro ao atualizar status premium.");
                    }
                  }}
                />
                <button
                  style={{ marginTop: "1rem" }}
                  onClick={() => {
                    setShowPaymentForm(false);
                    setShowUpgradeModal(false);
                  }}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
