const { sendEmail, getTaskAssignedTemplate } = require("../utils/emailService");
const cron = require("node-cron");

//realmente envia email de alerta de tarefas entao para nao dar problema é melhor comentar
async function runTaskReminder() {
  console.log("🔔 Rodando alerta automático de prazos de tarefas...");

  try {
    const [tasks] = await db.promise().query(
      `SELECT t.id, t.title, t.description, t.due_date, u.email, u.first_name
        FROM tasks t
        JOIN users u ON t.assigned_to = u.id
        WHERE t.due_date IS NOT NULL
          AND t.due_date >= NOW()
          AND t.due_date <= NOW() + INTERVAL 3 DAY`
    );

    if (tasks.length === 0) {
      console.log("Nenhuma tarefa com prazo próximo.");
      return;
    }

    const tasksByUser = {};
    tasks.forEach((task) => {
      const email = task.email;
      if (!tasksByUser[email]) {
        tasksByUser[email] = {
          firstName: task.first_name || "Usuário",
          tasks: [],
        };
      }
      tasksByUser[email].tasks.push(task);
    });

    for (const email in tasksByUser) {
      const { firstName, tasks } = tasksByUser[email];

      let message = `Olá ${firstName},\n\nEste é um email de teste enviado para o endereço ${email}.\nEle foi usado por motivos de teste. Por favor, ignore este email e não responda.\n\nObrigado!\n\nTaskFlow\n\n`;

      message += `Você tem as seguintes tarefas com prazo para os próximos 3 dias:\n\n`;
      tasks.forEach((task) => {
        const dueDate = new Date(task.due_date).toISOString().slice(0, 10);
        message += `- ${task.title} (prazo: ${dueDate})\n  Descrição: ${task.description}\n\n`;
      });

      message += "Por favor, acesse o sistema para mais detalhes.\n\nTaskFlow";

      await sendEmail(
        email,
        "Alerta de tarefas próximas (Email de teste)",
        message
      );
    }

    console.log(
      `✅ Enviados alertas para ${Object.keys(tasksByUser).length} usuários.`
    );
  } catch (err) {
    console.error("Erro ao enviar alertas de tarefas:", err);
  }
}

//  ❌ Se você não quiser que rode automaticamente, deixe isso comentado:
//  cron.schedule("5 14 * * *", runTaskReminder);

module.exports = runTaskReminder;
