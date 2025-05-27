import React, { useState } from "react";
import "./BarraLateral.css";

const BarraLateral = () => {
  const [ativo, setAtivo] = useState("Quadros");

  const handleClick = (item) => {
    setAtivo(item);
  };

  return (
    <aside className="menu-lateral p-3">
      <ul className="list-unstyled">
        <li
          className={`mb-3 fw-bold ${
            ativo === "Quadros" ? "text-primary" : "text-muted"
          }`}
          onClick={() => handleClick("Quadros")}
        >
          Quadros
        </li>
        <hr />
      </ul>
    </aside>
  );
};

export default BarraLateral;
