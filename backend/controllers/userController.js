cat << 'EOF' > controllers/userController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db"); 

exports.register = async (req, res) => {
  const { first_name, last_name, email, password, role, newEntityName } = req.body;

  if (role !== "admin") {
    return res.status(400).json({
      error: "Somente administradores podem se registrar diretamente.",
    });
  }

  if (!newEntityName || newEntityName.trim() === "") {
    return res.status(400).json({
      error: "Nome da nova entidade é obrigatório para administradores.",
    });
  }

  try {
    const [entityResult] = await db
      .promise()
      .query("INSERT INTO entities (name) VALUES (?)", [newEntityName.trim()]);
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
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erro interno no servidor" });
    if (results.length === 0)
      return res.status(401).json({ error: "Usuário não encontrado" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Senha incorreta" });

    const entityId = user.entity_id;
    if (!entityId)
      return res.status(401).json({ error: "Usuário sem entidade associada" });

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
  });
};

exports.getMembers = async (req, res) => {
  try {
    const [results] = await db
      .promise()
      .query("SELECT id, first_name, last_name, email FROM users WHERE role = 'member'");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar membros" });
  }
};

exports.getEntities = async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM entities");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar entidades" });
  }
};

exports.createEntity = async (req, res) => {
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
};

exports.associateUserToEntity = async (req, res) => {
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
};
EOF
