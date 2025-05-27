const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

const { authenticateToken } = require("../middleware/authenticateToken");
const { isAdmin, verifyTokenAndAdmin } = require("../middleware/roles"); 


router.get("/admin/members", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [results] = await db
      .promise()
      .query(
        "SELECT id, first_name, last_name, email FROM users WHERE role = 'member'"
      );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar membros" });
  }
});

router.get("/admin/entities", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM entities");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar entidades" });
  }
});

router.post("/admin/entities", authenticateToken, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.status(400).json({ error: "Nome da entidade é obrigatório" });

  try {
    const [result] = await db
      .promise()
      .query("INSERT INTO entities (name) VALUES (?)", [name]);
    res.json({
      message: "Entidade adicionada com sucesso",
      entityId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar entidade" });
  }
});

router.post("/admin/associate", authenticateToken, isAdmin, async (req, res) => {
  const { userId, entityId } = req.body;
  if (!userId || !entityId)
    return res.status(400).json({ error: "Dados incompletos" });

  try {
    await db
      .promise()
      .query("UPDATE users SET entity_id = ? WHERE id = ?", [entityId, userId]);
    res.json({ message: "Associação feita com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao associar membro à entidade" });
  }
});

router.get("/entity/:id/data", authenticateToken, async (req, res) => {
  const userEntityId = req.user.entityId;
  const entityIdParam = parseInt(req.params.id, 10);

  if (userEntityId !== entityIdParam) {
    return res.status(403).json({ error: "Acesso negado à entidade" });
  }

  try {
    const [data] = await db
      .promise()
      .query("SELECT * FROM entities WHERE id = ?", [entityIdParam]);
    if (!data[0])
      return res.status(404).json({ error: "Entidade não encontrada" });

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados da entidade" });
  }
});

router.get("/members", authenticateToken, (req, res) => {
  const entityId = req.user.entityId;
  const userId = req.user.id;

  const sql =
    "SELECT id, first_name, last_name, email FROM users WHERE entity_id = ? AND id != ?";

  db.query(sql, [entityId, userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar membros:", err);
      return res.status(500).json({ error: "Erro ao buscar membros" });
    }

    if (results.length === 0) {
      return res.json([
        { id: 0, first_name: "Nenhuma outra pessoa na equipe" },
      ]);
    }

    res.json(results);
  });
});

router.post("/create-member", authenticateToken, isAdmin, async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  const adminId = req.user.id;

  try {
    const [adminResult] = await db
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [adminId]);
    const admin = adminResult[0];

    if (!admin || !admin.entity_id) {
      return res.status(400).json({ error: "Admin sem entidade associada" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .promise()
      .query(
        `INSERT INTO users (email, password, role, entity_id, first_name, last_name) VALUES (?, ?, 'member', ?, ?, ?)`,
        [email, hashedPassword, admin.entity_id, first_name, last_name]
      );

    res.status(201).json({ message: "Membro criado com sucesso" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email já está em uso" });
    }
    res.status(500).json({ error: "Erro ao criar membro" });
  }
});


router.put("/update-password", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Senha atual e nova senha são obrigatórias" });
  }

  try {
    const [userResult] = await db
      .promise()
      .query("SELECT password FROM users WHERE id = ?", [userId]);
    const user = userResult[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Senha atual incorreta" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db
      .promise()
      .query("UPDATE users SET password = ? WHERE id = ?", [
        hashedNewPassword,
        userId,
      ]);

    res.json({ message: "Senha atualizada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar a senha" });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db
      .promise()
      .query(
        "SELECT id, first_name, last_name, email FROM users WHERE id = ?",
        [userId]
      );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar dados do usuário" });
  }
});

router.get("/entities/:entityId/members", authenticateToken, (req, res) => {
  const requestedEntityId = Number(req.params.entityId);
  const userEntityId = req.user.entityId;

  if (requestedEntityId !== userEntityId) {
    return res.status(403).json({ message: "Acesso negado à entidade." });
  }

  const sql = "SELECT id, first_name AS name FROM users WHERE entity_id = ?";

  db.query(sql, [requestedEntityId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar membros da entidade:", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar membros da entidade" });
    }

    res.json(results);
  });
});


router.post("/upgrade-to-premium", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    await db
      .promise()
      .query("UPDATE users SET premium = 1 WHERE id = ?", [userId]);
    res.json({ success: true, message: "Usuário atualizado para premium" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar usuário para premium" });
  }
});



module.exports = router;
