const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text, html = null) {
  const mailOptions = {
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado para ${to}`);
  } catch (err) {
    console.error("❌ Erro ao enviar email:", err);
  }
}

function getTaskAssignedTemplate({ nome, titulo, descricao }) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #ddd;">
      <h2 style="color: #2c3e50;">Olá ${nome},</h2>
      <p>Você foi designado(a) para uma nova tarefa no <strong>TaskFlow</strong>.</p>
      <p><strong>Título:</strong> ${titulo}</p>
      <p><strong>Descrição:</strong> ${descricao}</p>
      <p style="margin-top: 24px;">Acesse o sistema para mais detalhes.</p>
      <p style="font-size: 12px; color: #999;">Esta é uma mensagem automática. Não responda este e-mail.</p>
    </div>
  `;
}

module.exports = {
  sendEmail,
  getTaskAssignedTemplate,
};
