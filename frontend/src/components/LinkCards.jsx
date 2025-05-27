import React from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function LinkCards() {
  const cards = [
    {
      title: "Membros",
      link: "/inquilinos",
    },
    {
      title: "Projetos",
      link: "/projetos",
    },
  ];

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Row className="g-4 justify-content-center">
        {" "}
        {cards.map(({ title, link }) => (
          <Col key={title} md={4} style={{ maxWidth: "300px" }}>
            {" "}
            <Link
              to={link}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card className="h-100 text-center">
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Card.Title>{title}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
