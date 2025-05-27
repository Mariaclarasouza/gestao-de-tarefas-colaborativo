import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import "../styles/sidebar.css";
import { useAuth } from "../context/AuthContext";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

export default function Sidebar({ onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const links = [
    { name: "Início", path: "/dashboard" },
    { name: "Membros", path: "/inquilinos" },
    { name: "Projetos", path: "/projetos" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const goToPerfil = () => {
    navigate("/perfil");
  };

  return (
    <nav className="sidebar">
      <div className="user-section">
        <div ref={dropdownRef} className="user-menu-container">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="user-button"
            aria-label="Menu usuário"
          >
            <FiUser size={28} />
          </button>
          {dropdownOpen && (
            <div className="dropdown1">
              <NavDropdown.Item
                onClick={goToPerfil}
                className="nav-item-dropdown"
              >
                Perfil
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={handleLogout}
                className="nav-item-dropdown"
              >
                Logout
              </NavDropdown.Item>
            </div>
          )}
        </div>
      </div>

      <ul className="sidebar-list">
        {links.map(({ name, path }) => (
          <li key={path} className="sidebar-item">
            <NavLink
              to={path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
