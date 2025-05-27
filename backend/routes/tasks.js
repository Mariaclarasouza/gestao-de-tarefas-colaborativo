const { sendEmail, getTaskAssignedTemplate } = require("../utils/emailService");
const db = require("../db");
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authenticateToken");
const { canAccessTask } = require("../middleware/canAccessTask");
const multer = require("multer");
const path = require("path");

//console
console.log("canAccessTask:", canAccessTask);
console.log("typeof canAccessTask:", typeof canAccessTask);
console.log("authenticateToken:", canAccessTask);
console.log("typeof authenticateToken:", typeof authenticateToken);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../", "uploads/"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
router.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

router.get(
  "/tasks/:taskId/comments",
  authenticateToken,
  canAccessTask,
  async (req, res) => {
    const taskId = req.params.taskId;
    try {
      const [comments] = await db.promise().query(
        `SELECT c.id, c.comment_text, c.created_at, c.attachment_url, CONCAT(u.first_name, ' ', u.last_name) AS user_name
           FROM comments c
           JOIN users u ON c.user_id = u.id
           WHERE c.task_id = ?
           ORDER BY c.created_at ASC`,
        [taskId]
      );

      res.json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar comentários." });
    }
  }
);

router.post(
  "/tasks/:taskId/comments",
  authenticateToken,
  canAccessTask,
  upload.single("attachment"),
  async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const { comment_text } = req.body;
    const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!comment_text && !attachmentUrl) {
      return res
        .status(400)
        .json({ error: "Comentário ou anexo obrigatório." });
    }

    try {
      const [result] = await db
        .promise()
        .query(
          `INSERT INTO comments (task_id, user_id, comment_text, attachment_url) VALUES (?, ?, ?, ?)`,
          [taskId, userId, comment_text, attachmentUrl]
        );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar comentário." });
    }
  }
);

router.post("/boards/:boardId/tasks", authenticateToken, async (req, res) => {
  const boardId = req.params.boardId;
  const userEntityId = req.user.entityId;

  const { title, description, status, assigned_to, due_date } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Título e descrição são obrigatórios." });
  }

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

    const [result] = await db.promise().query(
      `INSERT INTO tasks 
         (board_id, title, description, status, assigned_to, due_date, entity_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        boardId,
        title,
        description,
        status || "todo",
        assigned_to || null,
        due_date || null,
        userEntityId,
      ]
    );

    if (assigned_to) {
      const [userRows] = await db
        .promise()
        .query("SELECT email, first_name FROM users WHERE id = ?", [
          assigned_to,
        ]);

      if (userRows.length > 0) {
        const email = userRows[0].email;
        const nome = userRows[0].first_name || "Responsável";

        const html = getTaskAssignedTemplate({
          nome,
          titulo: title,
          descricao: description,
        });

        // await sendEmail(
        //   email,
        //   `Nova tarefa atribuída: ${title}`,
        //   `Olá ${nome},\n\nVocê foi designado para a tarefa: "${title}".\nDescrição: ${description}.`,
        //   `Esse email foi enviado automaticamente pelo sistema TaskFlow, por motivos de teste, por favor ignore. \n\nObrigado!`,
        //   html
        // );
      }
    }

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar tarefa." });
  }
});

function formatDateForMySQL(isoDate) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().slice(0, 19).replace("T", " ");
}

router.put("/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    board_id,
    title,
    description,
    status,
    assigned_to,
    due_date,
    entity_id,
  } = req.body;

  const user_id = req.user.id;
  if (!user_id) {
    return res.status(400).json({ error: "Usuário (user_id) não informado" });
  }

  try {
    const [currentRows] = await db
      .promise()
      .query("SELECT * FROM tasks WHERE id = ?", [id]);
    const currentTask = currentRows[0];

    if (!currentTask) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    const changes = [];

    if (title !== currentTask.title) {
      changes.push({
        field: "title",
        oldValue: currentTask.title,
        newValue: title,
      });
    }
    if (description !== currentTask.description) {
      changes.push({
        field: "description",
        oldValue: currentTask.description,
        newValue: description,
      });
    }
    if (status !== currentTask.status) {
      changes.push({
        field: "status",
        oldValue: currentTask.status,
        newValue: status,
      });
    }
    if (assigned_to !== currentTask.assigned_to) {
      changes.push({
        field: "assigned_to",
        oldValue: currentTask.assigned_to,
        newValue: assigned_to,
      });
    }

    const currentDueDateFormatted = currentTask.due_date
      ? formatDateForMySQL(currentTask.due_date)
      : null;
    const newDueDateFormatted = due_date ? formatDateForMySQL(due_date) : null;

    if (newDueDateFormatted !== currentDueDateFormatted) {
      changes.push({
        field: "due_date",
        oldValue: currentDueDateFormatted,
        newValue: newDueDateFormatted,
      });
    }

    await db
      .promise()
      .query(
        `UPDATE tasks SET board_id=?, title=?, description=?, status=?, assigned_to=?, due_date=?, entity_id=? WHERE id=?`,
        [
          board_id,
          title,
          description,
          status,
          assigned_to,
          newDueDateFormatted,
          entity_id,
          id,
        ]
      );

    if (changes.length > 0) {
      await saveTaskHistory(id, user_id, changes);
    }

    res.status(200).json({ message: "Tarefa atualizada" });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
});

const saveTaskHistory = async (taskId, userId, changes) => {
  const values = changes.map((change) => [
    taskId,
    userId,
    change.field,
    change.oldValue,
    change.newValue,
  ]);

  const sql = `INSERT INTO task_history (task_id, changed_by, field_changed, old_value, new_value) VALUES ?`;

  await db.promise().query(sql, [values]);
};

router.get("/tasks/:id/history", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT th.*, CONCAT(u.first_name, ' ', u.last_name) AS user_name
         FROM task_history th
         JOIN users u ON th.changed_by = u.id
         WHERE task_id = ?
         ORDER BY changed_at DESC`,
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
});

router.put("/:id/complete", async (req, res) => {
  const { id } = req.params;
  try {
    await db
      .promise()
      .query("UPDATE tasks SET status = 'done' WHERE id = ?", [id]);
    res.status(200).json({ message: "Tarefa marcada como concluída" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao marcar tarefa como concluída" });
  }
});

router.put("/:id/uncomplete", async (req, res) => {
  const { id } = req.params;
  try {
    await db
      .promise()
      .query("UPDATE tasks SET status = 'todo' WHERE id = ?", [id]);
    res.status(200).json({ message: "Tarefa desmarcada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao desmarcar tarefa" });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Erro na transação" });

    db.query(
      "DELETE FROM task_history WHERE task_id = ?",
      [taskId],
      (error) => {
        if (error) {
          return db.rollback(() => {
            res.status(500).json({ error: "Erro ao excluir histórico" });
          });
        }

        db.query(
          "DELETE FROM tasks WHERE id = ?",
          [taskId],
          (error, results) => {
            if (error) {
              return db.rollback(() => {
                res.status(500).json({ error: "Erro ao excluir a tarefa" });
              });
            }

            if (results.affectedRows === 0) {
              return db.rollback(() => {
                res.status(404).json({ error: "Tarefa não encontrada" });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res
                    .status(500)
                    .json({ error: "Erro ao confirmar a exclusão" });
                });
              }
              res.status(200).json({ message: "Tarefa excluída com sucesso" });
            });
          }
        );
      }
    );
  });
});

module.exports = router;
