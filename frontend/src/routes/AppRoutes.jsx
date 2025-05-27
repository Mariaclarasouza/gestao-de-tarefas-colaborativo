import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/RegisterForm";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { useAuth } from "../context/AuthContext";
import Inquilinos from "../pages/Inquilinos";
import Perfil from "../pages/Perfil";
import Projetos from "../pages/Projetos";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="/inquilinos" element={<Inquilinos />} />
      <Route path="/projetos" element={<Projetos />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  );
}
