const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const { sendEmail, getTaskAssignedTemplate } = require("./utils/emailService");
const cron = require("node-cron");
const { body, validationResult } = require("express-validator");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const projectsRoutes = require("./routes/projects");
const tasksRoutes = require("./routes/tasks");
const runTaskReminder = require("./cron/taskReminderCron");

const app = express();
app.use(cors());
app.use(express.json());

//não descomentar se não quiser que rode automaticamente
// runTaskReminder();

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/", projectsRoutes);
app.use("/", tasksRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
