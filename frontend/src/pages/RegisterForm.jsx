import { useEffect, useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "member",
    newEntityName: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (form.role === "admin") {
        if (form.newEntityName.trim() === "") {
          setError("Nome da nova entidade é obrigatório para administradores.");
          return;
        }
      } else {
        setError("Membros não podem criar entidades.");
        return;
      }

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        role: form.role,
        newEntityName: form.newEntityName.trim(),
      };

      await axios.post("http://localhost:3001/auth/register", payload);

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Erro no cadastro");
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Registrar</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Sobrenome</Form.Label>
            <Form.Control
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select name="role" value={form.role} onChange={handleChange}>
              <option value="member">Membro</option>
              <option value="admin">Administrador</option>
            </Form.Select>
          </Form.Group>

          {form.role === "admin" && (
            <Form.Group className="mb-3">
              <Form.Label>Nome da nova entidade</Form.Label>
              <Form.Control
                type="text"
                name="newEntityName"
                value={form.newEntityName}
                onChange={handleChange}
                placeholder="Digite o nome da sua empresa"
                required
              />
            </Form.Group>
          )}

          <Button type="submit" className="w-100">
            Registrar
          </Button>
        </Form>
      </div>
    </div>
  );
}
