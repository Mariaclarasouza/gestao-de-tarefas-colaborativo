const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const db = require("../db");

function isAdmin(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Acesso negado" });
  next();
}

function verifyTokenAndAdmin(req, res, next) {
  const { authenticateToken } = require("./authenticateToken");
  authenticateToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Acesso negado: Admins somente" });
    }
    next();
  });
}

module.exports = { isAdmin, verifyTokenAndAdmin };
