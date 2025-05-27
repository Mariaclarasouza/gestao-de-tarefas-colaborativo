import React from "react";
import Sidebar from "../components/Sidebar";
import { IoPeople } from "react-icons/io5";
import ProjectCards from "../components/projetos/ProjetosCardsPage";
import { useAuth } from "../context/AuthContext";

export default function Projetos() {
  const { user } = useAuth();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        className="sidebar-container"
        style={{ width: "250px", marginTop: "60px" }}
      >
        <Sidebar />
      </div>

      <div
        className="content-container"
        style={{
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
        }}
      >
        <h1 className="tituloh1">
          Projetos <IoPeople />
        </h1>

        <ProjectCards user={user} token={user.token} />
        
      </div>
    </div>
  );
}
