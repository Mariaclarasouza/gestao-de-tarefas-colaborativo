import React, { useState, useEffect } from "react";
import { Form, ListGroup, Button } from "react-bootstrap";
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const ComentariosTarefa = ({ id }) => {
  const [comentarios, setComentarios] = useState([]);
  const [comentario, setComentario] = useState("");
  const comentariosRef = doc(db, "tarefas", id);

  useEffect(() => {
    const fetchComentarios = async () => {
      const docSnap = await getDoc(comentariosRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setComentarios(data.comentarios || []);
      } else {
        await setDoc(comentariosRef, { comentarios: [] });
        setComentarios([]);
      }
    };

    fetchComentarios();
  }, [id]);

  const adicionarComentario = async () => {
    if (comentario.trim()) {
      const novoComentario = comentario.trim();

      try {
        await updateDoc(comentariosRef, {
          comentarios: arrayUnion(novoComentario),
        });

        setComentarios((prev) => [...prev, novoComentario]);
        setComentario("");
      } catch (error) {
        console.error("Erro ao salvar comentário:", error);
      }
    }
  };

  return (
    <div className="mb-3">
      <Form.Label>Comentários</Form.Label>
      <Form.Control
        as="textarea"
        rows={2}
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Digite um comentário..."
        className="no-resize"
      />
      <Button
        size="sm"
        variant="primary"
        className="mt-2"
        onClick={adicionarComentario}
      >
        Adicionar Comentário
      </Button>

      {comentarios.length > 0 && (
        <ListGroup className="mt-3">
          {comentarios.map((c, i) => (
            <ListGroup.Item key={i}>{c}</ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default ComentariosTarefa;
