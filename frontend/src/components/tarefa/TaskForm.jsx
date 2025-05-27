import { Form, Button, Card, Row, Col, Spinner, Alert } from "react-bootstrap";

export default function TaskForm({
  newTask,
  setNewTask,
  handleSaveTask,
  creatingTask,
  editingTaskId,
  setShowTaskForm,
  setEditingTaskId,
  loadingMembers,
  errorMembers,
  members,
}) {
  return (
    <Card className="mb-4" onClick={(e) => e.stopPropagation()}>
      <Card.Body>
        <Form onSubmit={handleSaveTask}>
          <Form.Group controlId="taskTitle" className="mb-3">
            <Form.Label>Título da tarefa</Form.Label>
            <Form.Control
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
              disabled={creatingTask}
            />
          </Form.Group>
          <Form.Group controlId="taskDescription" className="mb-3">
            <Form.Label>Descrição da tarefa</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              required
              disabled={creatingTask}
            />
          </Form.Group>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="taskStatus">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                  disabled={creatingTask}
                >
                  <option value="todo">A fazer</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="done">Concluído</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="taskAssignedTo">
                <Form.Label>Responsável</Form.Label>
                {loadingMembers ? (
                  <div>
                    <Spinner animation="border" size="sm" /> Carregando
                    membros...
                  </div>
                ) : errorMembers ? (
                  <Alert variant="danger">{errorMembers}</Alert>
                ) : members.length === 0 ? (
                  <p className="text-warning">
                    Nenhum membro da equipe adicionado!
                  </p>
                ) : (
                  <Form.Select
                    value={newTask.assigned_to}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        assigned_to: e.target.value,
                      })
                    }
                    disabled={creatingTask}
                  >
                    <option value="">-- Selecione um membro --</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="taskDueDate">
                <Form.Label>Data de vencimento</Form.Label>
                <Form.Control
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) =>
                    setNewTask({ ...newTask, due_date: e.target.value })
                  }
                  disabled={creatingTask}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" disabled={creatingTask}>
            {creatingTask ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" />{" "}
                {editingTaskId ? "Salvando..." : "Criando..."}
              </>
            ) : editingTaskId ? (
              "Salvar alterações"
            ) : (
              "Criar tarefa"
            )}
          </Button>{" "}
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              setShowTaskForm(false);
              setEditingTaskId(null);
            }}
            disabled={creatingTask}
          >
            Cancelar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
