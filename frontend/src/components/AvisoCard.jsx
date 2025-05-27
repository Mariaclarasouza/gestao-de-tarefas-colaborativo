import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const mockAvisos = [
  { id: 1, message: "Reunião na sexta-feira às 14h" },
  { id: 2, message: "Entrega de relatórios até amanhã" },
];

export default function AvisoCard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotices(mockAvisos);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  function handleAddNotice() {
    if (!newMessage.trim()) return;

    const novoAviso = {
      id: Date.now(),
      message: newMessage,
    };

    setNotices((prev) => [novoAviso, ...prev]);
    setNewMessage("");
    setShowInput(false);
  }

  function handleDeleteNotice(id) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="aviso-card">
      <h3 className="aviso-title">Avisos</h3>

      <ul className="aviso-list">
        {notices.length === 0 && <li>Sem avisos no momento.</li>}
        {notices.map((n) => (
          <li key={n.id} className="aviso-item">
            <span className="aviso-message">{n.message}</span>
            {user?.role === "admin" && (
              <button
                onClick={() => handleDeleteNotice(n.id)}
                className="delete-btn"
                title="Deletar aviso"
              >
                <FaTrash />
              </button>
            )}
          </li>
        ))}
      </ul>

      {user?.role === "admin" && (
        <>
          {showInput ? (
            <div className="aviso-input-group">
              <input
                type="text"
                placeholder="Digite o aviso..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="aviso-input"
              />
              <div>
                <button
                  onClick={handleAddNotice}
                  className="aviso-btn save-btn"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className="aviso-btn cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="aviso-add-btn"
              aria-label="Adicionar aviso"
              title="Adicionar aviso"
            >
              <FiPlus />
            </button>
          )}
        </>
      )}
    </div>
  );
}
