const express = require("express");
const router = express.Router();
const RtController = require("../controllers/rt_controller");

router.get("/countIndicadores", RtController.listaCountIndicadores);
router.get("/indicadores/:mes/:ano/:loja", RtController.listaIndicadores);
router.get("/prevendas/:indicador/:mes/:ano/:loja", RtController.listaPreVendas);
router.get("/produtos/:prevenda", RtController.listaProdutos);
router.get("/prevendas/:indicador/:periodo", RtController.atualizaTotalPreVendas);
router.get("/prevendas/listarlojas", RtController.listaLojas);

//router.post("/", login.obrigatorio, ProdutoController.salvarProduto);


module.exports = router;