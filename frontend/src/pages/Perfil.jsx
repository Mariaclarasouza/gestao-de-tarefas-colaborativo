import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaUser } from "react-icons/fa";
import PaymentModule from "../components/PaymentModule";

function Perfil() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário", err);
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.put(
        "http://localhost:3001/users/update-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Senha atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erro ao atualizar senha";
      setMessage(errorMsg);
    }
  };

  const handlePaymentSuccess = () => {
    alert("Usuário agora é premium!");
    setShowPaymentForm(false);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="sidebar-container"
        style={{ width: "250px", marginTop: "60px" }}
      >
        <Sidebar />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="perfil-header d-flex"
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "40px",
            width: "100%",
          }}
        >
          <h1
            className="tituloh1"
            style={{ display: "flex", alignItems: "center" }}
          >
            Perfil{" "}
            <FaUser
              size={50}
              style={{ marginLeft: "15px" }}
              className="icon-header"
            />
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "0",
            width: "100%",
          }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <div className="perfil-header mb-4"></div>

            <div
              className="mb-3"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <strong
                style={{ marginRight: "8px", minWidth: "60px" }}
                className="span-titulos"
              >
                Nome:
              </strong>
              <span className="span-titulos">
                {user.first_name} {user.last_name}
              </span>
            </div>
            <div
              className="mb-3"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <strong
                style={{ marginRight: "8px", minWidth: "60px" }}
                className="span-titulos"
              >
                Email:
              </strong>
              <span className="span-titulos">{user.email}</span>
            </div>

            <form onSubmit={handleUpdatePassword}>
              <div className="mb-3">
                <label className="form-label">Senha atual:</label>
                <input
                  type="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nova senha:</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="botao-enviar btn w-100">
                Atualizar senha
              </button>
            </form>

            {message && (
              <p
                className="mt-3"
                style={{
                  color: message.includes("sucesso") ? "green" : "red",
                  textAlign: "center",
                }}
              >
                {message}
              </p>
            )}
          </div>
          <div
            style={{
              marginTop: "1.5rem",
              fontSize: "1.2rem",
              fontWeight: "500",
            }}
          >
            Por apenas <strong>5 reais por mês</strong>, você pode criar mais de
            5 projetos e tchananã!
          </div>
          {!showPaymentForm && (
            <button
              onClick={() => setShowPaymentForm(true)}
              style={{ marginTop: "1rem" }}
            >
              Fazer Upgrade para Premium
            </button>
          )}
          {showPaymentForm && (
            <>
              <PaymentModule onPaymentSuccess={handlePaymentSuccess} />
              <button
                onClick={() => setShowPaymentForm(false)}
                style={{ marginTop: "1rem" }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perfil;
