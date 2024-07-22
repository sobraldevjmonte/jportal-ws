const express = require("express");
const router = express.Router();

const ProfissionaisController = require("../controllers/profissionais_controller");



router.get("/profissionais/listar-pedidos", ProfissionaisController.listarPedidos);
router.get("/profissionais/listar-usuarios", ProfissionaisController.listarUsuarios);
router.put("/profissionais/ativar-usuario/:id", ProfissionaisController.ativarUsuario);
router.put("/profissionais/inativar-usuario/:id", ProfissionaisController.inativarUsuario);


module.exports = router;
