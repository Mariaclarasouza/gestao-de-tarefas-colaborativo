import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/inquilinos.css";
import { IoPeople } from "react-icons/io5";
import Membros from "../components/Membros";

export default function Inquilinos() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [message, setMessage] = useState("");

  const toggleForm = () => setShowForm(!showForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3001/users/create-member",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setForm({ email: "", password: "", first_name: "", last_name: "" });
      setShowForm(false);
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          "Erro ao adicionar membro, não pode adicionar se não for administrador."
      );
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        className="sidebar-container"
        style={{ width: "250px", marginTop: "60px" }}
      >
        <Sidebar />
      </div>

      <div
        className="content-container"
        style={{
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
        }}
      >
        <h1 className="tituloh1">
          Membros <IoPeople />
        </h1>
        <Membros />

        <button onClick={toggleForm} className="add-member-button">
          {showForm ? "Cancelar" : "Adicionar Membro"}
        </button>

        {showForm && (
          <div className="add-member-card">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="first_name"
                placeholder="Nome"
                value={form.first_name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Sobrenome"
                value={form.last_name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="submit-button">
                Salvar
              </button>
            </form>
          </div>
        )}

        {message && <p className="feedback-message">{message}</p>}
      </div>
    </div>
  );
}
