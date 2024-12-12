// routes/adminRoutes.js

const { Router } = require("express");
const adminController = require("../controllers/adminController");
const {
  validateAdmin,
  validateAdminId,
} = require("../middlewares/validateAdmin");
const authenticate = require("../middlewares/authenticate");

const router = Router();

// Rota para criar um administrador
router.post("/", adminController.create);

router.post("/login", adminController.login);

// Aplicar o middleware de autenticação a todas as rotas abaixo
router.use(authenticate);

// Rota para atualizar um administrador por ID
router.put("/:id", validateAdminId, validateAdmin, adminController.update);

// Rota para deletar um administrador por ID
router.delete("/:id", validateAdminId, adminController.delete);

// Rota para obter um administrador por ID
router.get("/:id", validateAdminId, adminController.getOne);

// Rota para obter todos os administradores
router.get("/", adminController.getAll);

module.exports = router;
