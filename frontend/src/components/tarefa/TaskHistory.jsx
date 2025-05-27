import { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Spinner } from "react-bootstrap";

const TaskHistory = ({ taskId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/tasks/${taskId}/history`
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Erro ao carregar histórico", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [taskId]);

  if (loading) return <Spinner animation="border" size="sm" />;

  return (
    <div className="mt-3">
      <h6>Histórico de Alterações</h6>
      <Accordion>
        {history.map((h, index) => (
          <Accordion.Item eventKey={index.toString()} key={h.id}>
            <Accordion.Header>
              {h.user_name} alterou {h.field_changed}
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <i>De:</i> {h.old_value || "vazio"}
                <br />
                <i>Para:</i> {h.new_value || "vazio"}
                <br />
                <small>{new Date(h.change_date).toLocaleString()}</small>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default TaskHistory;
