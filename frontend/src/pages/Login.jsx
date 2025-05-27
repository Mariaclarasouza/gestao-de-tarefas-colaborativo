import { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { token, role, entityId, userId, email } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      setUser({
        token,
        userId,
        role,
        entityId,
        email,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Erro no login");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Entrar
          </Button>
        </Form>

        <div className="register-link">
          <p>
            Não tem conta? <Link to="/register">Registrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
