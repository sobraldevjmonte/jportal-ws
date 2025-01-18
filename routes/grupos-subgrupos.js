const express = require("express");
const router = express.Router();
const grupoSubGrupoController = require("../controllers/grupo-subgrupo-controller");

router.get("/grupos-subgrupos/listar-grupos/:loja/:mes", grupoSubGrupoController.listarGrupos);
router.get("/grupos-subgrupos/listar-grupos-ano-anterior/:loja/:mes", grupoSubGrupoController.listarGruposAnoAnterior);
router.get("/grupos-subgrupos/listar-codigos-grupos/:grupo", grupoSubGrupoController.listarCodigosDosGrupos);
router.get("/grupos-subgrupos/listar-vendas-por-loja/:grupo/:loja/:mes", grupoSubGrupoController.listarVendasPorLoja);
router.get("/grupos-subgrupos/listar-vendas-por-loja-ano-anterior/:grupo/:loja/:mes", grupoSubGrupoController.listarVendasPorLojaAnoAnterior);


module.exports = router;