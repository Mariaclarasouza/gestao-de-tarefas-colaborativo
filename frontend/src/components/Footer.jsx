import { Container, Nav } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-5 border-top">
      <Container className="d-flex justify-content-between flex-wrap">
        <p className="mb-2 mb-md-0 text-muted">
          &copy; {new Date().getFullYear()} Sua Empresa
        </p>
        <Nav>
          <Nav.Link href="/membros" className="text-muted px-2">
            Membros
          </Nav.Link>
          <Nav.Link href="/calendario" className="text-muted px-2">
            Calendário
          </Nav.Link>
          <Nav.Link href="/pagamentos" className="text-muted px-2">
            Pagamentos
          </Nav.Link>
        </Nav>
      </Container>
    </footer>
  );
};

export default Footer;
