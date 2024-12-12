// middlewares/authenticate.js

const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Obtém o token do header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: "Token de autenticação não fornecido" });
  }

  const token = authHeader.split(" ")[1]; // Formato: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: "Token de autenticação não fornecido" });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded; // Adiciona os dados do usuário à requisição
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token de autenticação inválido" });
  }
};

module.exports = authenticate;
