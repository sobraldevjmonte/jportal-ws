const express = require("express");
const router = express.Router();

const ProfissionaisPedidosController = require("../controllers/profissionais_pedidos_controller");



router.get("/profissionais-pedidos/listar-pedidos", ProfissionaisPedidosController.listarPedidos);
router.post("/profissionais-pedidos/aprovar-pedido/:id_pedido/:id_autorizador", ProfissionaisPedidosController.aprovarPedido);
router.post("/profissionais-pedidos/rejeitar-pedido/:id_pedido/:id_parceiro", ProfissionaisPedidosController.rejeitaPedido);
router.post("/profissionais-pedidos/entregar-pedido/:id_pedido/:id_premio/:id_entregador", ProfissionaisPedidosController.entregarPedido);
router.post("/profissionais-pedidos/liberar-pedido/:id_pedido/:id_premio", ProfissionaisPedidosController.liberarPedido);

module.exports = router;