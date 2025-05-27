import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Spinner,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

export default function PaymentModule({ onPaymentSuccess }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handlePayment = (e) => {
    e.preventDefault();

    if (
      cardNumber.length !== 16 ||
      !cardName ||
      expiry.length !== 5 ||
      cvv.length !== 3
    ) {
      let message = "Por favor, preencha todos os dados corretamente.";
      if (cardNumber.length !== 16)
        message = "O número do cartão deve ter 16 dígitos.";
      else if (!cardName) message = "O nome no cartão é obrigatório.";
      else if (expiry.length !== 5)
        message = "A validade deve estar no formato MM/AA.";
      else if (cvv.length !== 3) message = "O CVV deve ter 3 dígitos.";
      setError(message);
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Pagamento aprovado! Você agora é usuário premium.");
      if (onPaymentSuccess) onPaymentSuccess();
    }, 2000);
  };

  const fieldHints = {
    cardNumber: "O número do cartão deve ter 16 dígitos.",
    cardName: "Digite exatamente como aparece no cartão.",
    expiry: "Formato MM/AA. Ex: 12/26",
    cvv: "Os 3 dígitos no verso do cartão.",
  };

  const renderHint = (field) =>
    focusedField === field && (
      <Form.Text className="text-muted">{fieldHints[field]}</Form.Text>
    );

  return (
    <Container>
      <h3 className="mb-4">Pagamento Premium</h3>
      <Form onSubmit={handlePayment}>
        <Form.Group className="mb-3">
          <Form.Label>Número do Cartão</Form.Label>
          <Form.Control
            type="text"
            maxLength="16"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
            onFocus={() => setFocusedField("cardNumber")}
            onBlur={() => setFocusedField(null)}
            placeholder="1234 1234 1234 1234"
            required
          />
          {renderHint("cardNumber")}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nome no Cartão</Form.Label>
          <Form.Control
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            onFocus={() => setFocusedField("cardName")}
            onBlur={() => setFocusedField(null)}
            placeholder="Seu nome"
            required
          />
          {renderHint("cardName")}
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Validade (MM/AA)</Form.Label>
              <Form.Control
                type="text"
                maxLength="5"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                onFocus={() => setFocusedField("expiry")}
                onBlur={() => setFocusedField(null)}
                placeholder="12/25"
                required
              />
              {renderHint("expiry")}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="password"
                maxLength="3"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                onFocus={() => setFocusedField("cvv")}
                onBlur={() => setFocusedField(null)}
                placeholder="123"
                required
              />
              {renderHint("cvv")}
            </Form.Group>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" className="mt-2">
            {error}
          </Alert>
        )}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Processando...
            </>
          ) : (
            "Pagar e Ativar Premium"
          )}
        </Button>
      </Form>
    </Container>
  );
}
