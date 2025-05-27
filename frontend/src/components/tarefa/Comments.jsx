import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  Card,
  ListGroup,
  Button,
  ProgressBar,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

export default function Comments({ taskId, user }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [creatingComment, setCreatingComment] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = () => {
    setLoadingComments(true);
    setErrorComments(null);
    axios
      .get(`http://localhost:3001/tasks/${taskId}/comments`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setComments(res.data);
        setLoadingComments(false);
      })
      .catch((err) => {
        setErrorComments("Erro ao carregar comentários.");
        setLoadingComments(false);
        console.error(err);
      });
  };
  const [file, setFile] = useState(null);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() && !file) return;

    setCreatingComment(true);
    const formData = new FormData();
    formData.append("comment_text", newComment);
    if (file) formData.append("attachment", file);

    try {
      await axios.post(
        `http://localhost:3001/tasks/${taskId}/comments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNewComment("");
      setFile(null);
      await fetchComments();
    } catch (err) {
      console.error("Erro ao criar comentário com arquivo:", err);
      alert("Erro ao criar comentário.");
    } finally {
      setCreatingComment(false);
    }
  };

  if (loadingComments)
    return (
      <div className="mb-3">
        <Spinner animation="border" size="sm" /> Carregando comentários...
      </div>
    );
  if (errorComments) return <Alert variant="danger">{errorComments}</Alert>;

  const generateReport = () => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const done = tasks.filter((t) => t.status === "done").length;

    const averageDueDate =
      tasks
        .filter((t) => t.due_date)
        .map((t) => new Date(t.due_date).getTime())
        .reduce((acc, val, _, arr) => acc + val / arr.length, 0) || null;

    const userTaskCounts = tasks.reduce((acc, task) => {
      const uid = task.assigned_to || "Não atribuído";
      acc[uid] = (acc[uid] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      todo,
      inProgress,
      done,
      averageDueDate: averageDueDate ? new Date(averageDueDate) : null,
      userTaskCounts,
    };
  };

  return (
    <Card className="mt-3">
      <Card.Header as="h6">Comentários</Card.Header>
      <Card.Body>
        {comments.length === 0 ? (
          <p className="text-muted">Nenhum comentário.</p>
        ) : (
          <ListGroup variant="flush">
            {comments.map((comment) => (
              <ListGroup.Item key={comment.id}>
                <strong>{comment.user_name || "Usuário"}:</strong>{" "}
                {comment.comment_text}
                {comment.attachment_url && (
                  <div style={{ marginTop: "8px" }}>
                    {/\.(jpg|jpeg|png|gif)$/i.test(comment.attachment_url) ? (
                      <img
                        src={`http://localhost:3001${comment.attachment_url}`}
                        alt="Anexo"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    ) : (
                      <a
                        href={`http://localhost:3001${comment.attachment_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver anexo
                      </a>
                    )}
                  </div>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <Form
          onSubmit={handleCreateComment}
          className="mt-3"
          encType="multipart/form-data"
        >
          <Form.Group controlId={`commentTextarea-${taskId}`} className="mb-2">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Adicionar comentário"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              disabled={creatingComment}
            />
          </Form.Group>

          <Form.Group controlId={`fileInput-${taskId}`} className="mb-2">
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={creatingComment}
            />
          </Form.Group>

          <Button
            type="submit"
            size="sm"
            disabled={creatingComment}
            className="create-btn"
          >
            {creatingComment ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
