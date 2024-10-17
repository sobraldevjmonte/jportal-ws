const express = require("express");
const router = express.Router();
const entregasContatosController = require("../controllers/entregas_contatos_controller");


router.get("/entregas-contatos/lista-entregas-contatos-vendedor/:idVendedor", entregasContatosController.listarEntregasContatosVendedor);
router.post("/entregas-contatos/salvar-obs-vendedor", entregasContatosController.salvarObsVendedor);
router.put("/entregas-contatos/alterar-obs-vendedor", entregasContatosController.alterarObsVendedor);

module.exports = router;