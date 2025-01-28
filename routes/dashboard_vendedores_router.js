const express = require("express");
const router = express.Router();
const DashboardVendedor = require("../controllers/dashboard/dashboard_vendedores_controller");


//-------------------------- POR VENDEDEDOR GERAL --------------------------------
router.get("/dashboard/lista-dashboard-vendedor-geral-hoje/:idVendedor", DashboardVendedor.listaDadosGeralVendedorHoje);
router.get("/dashboard/lista-dashboard-vendedor-geral-um-dia/:idVendedor", DashboardVendedor.listaDadosGeralVendedorDiaAnterior);
router.get("/dashboard/lista-dashboard-vendedor-geral-semana-anterior/:idVendedor", DashboardVendedor.listaDadosGeralVendedorSemanaAnterior);
router.get("/dashboard/lista-dashboard-vendedor-geral-mes-anterior/:idVendedor", DashboardVendedor.listaDadosGeralVendedorMesAnterior);
router.get("/dashboard/lista-dashboard-vendedor-geral-seis-meses/:idVendedor", DashboardVendedor.listaDadosGeralVendedorSeisMeses);


// ---------------------- POR VENDEDOR X CLIENTES RANKING --------------------
router.get("/dashboard/lista-dashboard-vendedor-cliente-lista/:idVendedor", DashboardVendedor.listaDadosGeralVendedorClienteLista);
router.get("/dashboard/lista-dashboard-vendedor-cliente-lista-detalhes/:vendedor/:cliente", DashboardVendedor.listaDadosGeralVendedorClienteListaDetalhe);
// router.get("/dashboard/lista-dashboard-vendedor-cliente-um-dia/:idVendedor", DashboardVendedor.listaDadosGeralVendedorClienteDiaAnterior);

// ---------------------- POR VENDEDOR X INDICADOR RANKING --------------------
router.get("/dashboard/lista-dashboard-vendedor-indicador-lista/:idVendedor", DashboardVendedor.listaDadosGeralVendedorIndicadorLista);
router.get("/dashboard/lista-dashboard-vendedor-indicador-lista-detalhes/:vendedor/:indicador", DashboardVendedor.listaDadosGeralVendedorIndicadorListaDetalhe);

//-------------------------- LSITA NP POR VENDEDOR -----------------------------
router.get("/dashboard/lista-dashboard-nps-vendedor-cliente/:idLoja/:idCliente", DashboardVendedor.listaDadosVendedorClientesNps);




module.exports = router; 

