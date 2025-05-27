import { Accordion, Button, Card } from "react-bootstrap";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import Comments from "./Comments";
import TaskHistory from "./TaskHistory";

export default function TaskItem({
  task,
  toggleAccordion,
  activeKey,
  toggleComplete,
  getMemberNameById,
  formatDate,
  handleEditTask,
  handleDeleteTask,
  user,
}) {
  return (
    <Accordion.Item eventKey={task.id}>
      <Accordion.Header onClick={() => toggleAccordion(task.id)}>
        <span
          onClick={(e) => {
            e.stopPropagation();
            toggleComplete(task.id);
          }}
          style={{
            cursor: "pointer",
            marginRight: "8px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: task.status === "done" ? "#4CAF50" : "transparent",
            color: task.status === "done" ? "white" : "gray",
            borderRadius: "50%",
          }}
        >
          {task.status === "done" ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
        </span>
        <div>
          <strong>{task.title}</strong> -{" "}
          {task.description?.length > 50
            ? task.description.substring(0, 50) + "..."
            : task.description}
        </div>
      </Accordion.Header>

      <Accordion.Body>
        <Card.Text>
          <strong>Status:</strong>{" "}
          {task.status ? task.status.replace("_", " ") : "Indefinido"}
        </Card.Text>
        <Card.Text>
          <strong>Responsável:</strong> {getMemberNameById(task.assigned_to)}
        </Card.Text>
        <Card.Text>
          <strong>Vencimento:</strong> {formatDate(task.due_date)}
        </Card.Text>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditTask(task);
            }}
          >
            <MdEdit /> Editar
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTask(task.id);
            }}
          >
            <MdDelete /> Excluir
          </Button>
        </div>

        <Comments taskId={task.id} user={user} />
        <TaskHistory taskId={task.id} />
      </Accordion.Body>
    </Accordion.Item>
  );
}
