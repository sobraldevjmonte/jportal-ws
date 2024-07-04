const express = require("express");
const router = express.Router();
const AnaliseNpController = require("../controllers/analise_np_controller");

router.get("/analisenp/listar-nps/:mes/:ano/:idLoja", AnaliseNpController.listarNps);
router.get("/analisenp/listar-produtos-np/:np", AnaliseNpController.listarProdutosNp);
//router.get("/indicadores/:mes/:ano/:loja", RtController.listaIndicadores);

module.exports = router;