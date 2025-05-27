const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authenticateToken = require("../middleware/authenticateToken");
const bcrypt = require("bcrypt");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err)
        return res.status(500).json({ error: "Erro interno no servidor" });
      if (results.length === 0)
        return res.status(401).json({ error: "Usuário não encontrado" });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Senha incorreta" });

      const entityId = user.entity_id;
      if (!entityId)
        return res
          .status(401)
          .json({ error: "Usuário sem entidade associada" });

      const token = jwt.sign(
        { id: user.id, role: user.role, entityId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login realizado com sucesso",
        token,
        role: user.role,
        entityId,
        userId: user.id,
      });
    }
  );
});

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("first_name").notEmpty().withMessage("Primeiro nome é obrigatório"),
    body("last_name").notEmpty().withMessage("Último nome é obrigatório"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres"),
    body("newEntityName")
      .notEmpty()
      .withMessage("Nome da nova entidade é obrigatório para administradores"),
  ],
  async (req, res) => {
    const { first_name, last_name, email, password, role, newEntityName } =
      req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (role !== "admin") {
      return res.status(400).json({
        error: "Somente administradores podem se registrar diretamente.",
      });
    }

    try {
      const [entityResult] = await db
        .promise()
        .query("INSERT INTO entities (name) VALUES (?)", [
          newEntityName.trim(),
        ]);
      const associatedEntityId = entityResult.insertId;

      const hash = await bcrypt.hash(password, 10);

      await db
        .promise()
        .query(
          `INSERT INTO users (first_name, last_name, email, password, role, entity_id) VALUES (?, ?, ?, ?, ?, ?)`,
          [first_name, last_name, email, hash, "admin", associatedEntityId]
        );

      res.json({
        message: "Usuário registrado e associado à entidade com sucesso",
      });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email já está em uso" });
      }
      return res.status(500).json({ error: "Erro ao registrar usuário" });
    }
  }
);

module.exports = router;
