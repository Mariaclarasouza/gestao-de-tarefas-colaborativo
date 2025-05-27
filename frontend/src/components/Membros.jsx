import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Membros() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/users/members", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Erro desconhecido");
        }
        return res.json();
      })
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar membros:", err.message);
        setMembers([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando membros...</p>;

  return (
    <div className="container-membros">
      {members.map((member) => (
        <div key={member.id} className="card-membros">
          <h3>
            {member.first_name} {member.last_name}
          </h3>
          <p className="h3-nome-membros">
            <b>Email:</b> {member.email}
          </p>
        </div>
      ))}
    </div>
  );
}
