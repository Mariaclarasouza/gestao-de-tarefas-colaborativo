const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token não enviado" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token mal formatado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ error: "Token inválido ou expirado" });
    req.user = user;
    console.log(req.user);
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") return res.sendStatus(403);
  next();
}

module.exports = {
  authenticateToken,
  isAdmin,
};
