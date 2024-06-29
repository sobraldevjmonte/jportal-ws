const express = require("express");
const router = express.Router();
const EtapasController = require("../controllers/etapas-controller");

router.get("/etapas/lista-vendedores", EtapasController.listaVendedores);
router.get("/etapas/filtrar-vendedores/:idLoja", EtapasController.filtrarVendedores);
router.get("/etapas/listarlojas", EtapasController.listaLojas);
router.get("/etapas/listar-clientes/:idLoja", EtapasController.listarClientes);
router.get("/etapas/lista-etapas", EtapasController.listaEtapas);
router.get("/etapas/lista-pendencias-vendas/:idVendedor/:ordem", EtapasController.listaVendasVendedores);
router.get("/etapas/lista-soma-etapas-por-vendedor/:idVendedor", EtapasController.listaSomaEtapasPeloVendedor);
router.get("/etapas/lista-contatos-feitos/:idCliente", EtapasController.listaContatosFeitosParaCliente);
router.post("/etapas/salvar-obervacao", EtapasController.salvarObervacao);

//********************** GERENTE  ********************/
router.get("/etapas/lista-vendedores-por-loja/:idLoja/:ordem", EtapasController.listaVendedoresPorLoja);
router.get("/etapas/lista-soma-etapas-por-loja/:idLoja", EtapasController.listaSomaEtapasPorLoja);


//********************** ADMIN  ********************/
router.get("/etapas/lista-admin-pendencias-por-loja/:idUsuario", EtapasController.listaAdminPendenciasPorLoja);
router.get("/etapas/lista-admin-soma-pendencias-por-loja/:idUsuario", EtapasController.listaAdminSomaPendenciasPorLoja);


module.exports = router; 