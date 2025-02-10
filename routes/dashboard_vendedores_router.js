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

// ---------------------- POR VENDEDOR X INDICADOR RANKING --------------------
router.get("/dashboard/lista-dashboard-vendedor-indicador-lista/:idVendedor", DashboardVendedor.listaDadosGeralVendedorIndicadorLista);
router.get("/dashboard/lista-dashboard-vendedor-indicador-lista-detalhes/:vendedor/:indicador", DashboardVendedor.listaDadosGeralVendedorIndicadorListaDetalhe);

//-------------------------- LSITA NP POR VENDEDOR -----------------------------
router.get("/dashboard/lista-dashboard-nps-vendedor-cliente/:idLoja/:idCliente/:idVendedor", DashboardVendedor.listaDadosVendedorClientesNps);

//-------------------------- LSITA NP CLIENTES POR LOJA -----------------------------
router.get("/dashboard/lista-dashboard-nps-gerente-cliente/:idLoja/:idCliente", DashboardVendedor.listaDadosGerenteClientesNps);

//-------------------------- LSITA NP POR VENDEDOR GERAL-----------------------------
router.get("/dashboard/lista-dashboard-nps-vendedor-nps-geral-hoje/:idLoja/:periodo/:idVendedor", DashboardVendedor.listaDadosVendedorGeralNps);




module.exports = router; 

