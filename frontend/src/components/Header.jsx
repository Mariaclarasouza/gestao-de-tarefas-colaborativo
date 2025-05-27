import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "../styles/dashboard.css";

export default function Header({ entityName, userFirstName }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const goToPerfil = () => {
    navigate("/perfil");
  };

  return (
    <Navbar expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/">{entityName || "TaskFlow"}</Navbar.Brand>
        <Nav className="ms-auto">
          <NavDropdown
            title={
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaUser />
                {userFirstName || "Usuário"}
              </span>
            }
            id="user-dropdown"
            align="end"
          >
            <NavDropdown.Item onClick={goToPerfil}>Perfil</NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
