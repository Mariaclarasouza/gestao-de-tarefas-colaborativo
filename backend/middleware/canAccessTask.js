const db = require("../db");

async function canAccessTask(req, res, next) {
  const taskId = req.params.taskId;
  const userEntityId = req.user.entityId;

  try {
    const tasks = await db.promise().query(
      `SELECT t.id FROM tasks t
         JOIN boards p ON t.board_id = p.id
         WHERE t.id = ? AND p.entity_id = ?`,
      [taskId, userEntityId]
    );

    if (tasks.length === 0) {
      return res.status(403).json({ error: "Acesso negado à tarefa." });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
}

module.exports = { canAccessTask };
