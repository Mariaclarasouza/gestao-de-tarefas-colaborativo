const express = require("express");
const router = express.Router();
const db = require("../db");

const { authenticateToken } = require("../middleware/authenticateToken");
const { isAdmin, verifyTokenAndAdmin } = require("../middleware/roles"); 


router.get("/projects", authenticateToken, async (req, res) => {
    const userEntityId = req.user.entityId;
  
    try {
      const [rows] = await db
        .promise()
        .query(
          "SELECT * FROM boards WHERE entity_id = ? ORDER BY created_at DESC",
          [userEntityId]
        );
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar quadros" });
    }
  });
  
  router.post("/projects", authenticateToken, async (req, res) => {
    const { name, description } = req.body;
    const userEntityId = req.user.entityId;
    const userId = req.user.id;
  
    if (!name) {
      return res.status(400).json({ error: "Nome do projeto é obrigatório" });
    }
  
    try {
      const [userRows] = await db
        .promise()
        .query("SELECT premium FROM users WHERE id = ?", [userId]);
  
      if (userRows.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
  
      const isPremium = userRows[0].premium;
  
      if (!isPremium) {
        const [projectCountRows] = await db
          .promise()
          .query("SELECT COUNT(*) as count FROM boards WHERE entity_id = ?", [
            userEntityId,
          ]);
  
        const projectCount = projectCountRows[0].count;
  
        if (projectCount >= 5) {
          return res.status(403).json({
            error: "Limite de 5 projetos atingido para usuários não premium",
            needUpgrade: true,
          });
        }
      }
      const [result] = await db.promise().query(
        `INSERT INTO boards (title, description, entity_id, created_by, created_at, updated_at) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [name, description || "", userEntityId, userId]
      );
  
      const [rows] = await db
        .promise()
        .query("SELECT * FROM boards WHERE id = ?", [result.insertId]);
  
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar quadro" });
    }
  });

  router.get("/boards/:boardId/tasks", authenticateToken, async (req, res) => {
    const boardId = req.params.boardId;
    const userEntityId = req.user.entityId;
  
    try {
      const [boards] = await db
        .promise()
        .query("SELECT id FROM boards WHERE id = ? AND entity_id = ?", [
          boardId,
          userEntityId,
        ]);
      if (boards.length === 0) {
        return res.status(403).json({ error: "Acesso negado ao quadro." });
      }
  
      const [tasks] = await db
        .promise()
        .query("SELECT * FROM tasks WHERE board_id = ?", [boardId]);
      res.json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar tarefas." });
    }
  });

  module.exports = router;