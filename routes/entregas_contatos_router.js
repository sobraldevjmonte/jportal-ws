const express = require("express");
const router = express.Router();
const entregasContatosController = require("../controllers/entregas_contatos_controller");


//******************** vendedores  **************/
router.get("/entregas-contatos/lista-entregas-contatos-vendedor/:codigLoja/:idVendedor", entregasContatosController.listarEntregasContatosVendedor);
router.post("/entregas-contatos/salvar-obs-vendedor", entregasContatosController.salvarObsVendedor);
router.put("/entregas-contatos/alterar-obs-vendedor", entregasContatosController.alterarObsVendedor);

//******************** gerente  **************/
router.get("/entregas-contatos/lista-vendedores-do-gerente/:codigoLoja", entregasContatosController.listaVendedoresDoGerente);
router.get("/entregas-contatos/lista-entregas-contatos-gerente/:idVendedor", entregasContatosController.listarEntregasContatosGerente);

// ********************* admin ***************
router.get("/entregas-contatos/lista-lojas-do-admin", entregasContatosController.listaLojasDoAdmin);

module.exports = router;