const express = require("express");
const router = express.Router();
const DashboardGerente = require("../controllers/dashboard/dashboard_gerentes_controller");


//******************************** gerentes *********************************/
//******************************** gerentes *********************************/
//******************************** gerentes *********************************/

//-------------------------- POR GERENTE GERAL --------------------------------
router.get("/dashboard/lista-dashboard-gerente-geral-um-dia/:idLoja", DashboardGerente.listaDadosGeralGerenteDiaAnterior);
router.get("/dashboard/lista-dashboard-gerente-geral-semana-anterior/:idLoja", DashboardGerente.listaDadosGeralGerenteSemanaAnterior);
router.get("/dashboard/lista-dashboard-gerente-geral-mes-anterior/:idLoja", DashboardGerente.listaDadosGeralGerenteMesAnterior);
router.get("/dashboard/lista-dashboard-gerente-geral-seis-meses/:idLoja", DashboardGerente.listaDadosGeralGerenteSeisMeses);


// ---------------------- POR GERENTE X CLIENTES RANKING --------------------
router.get("/dashboard/lista-dashboard-gerente-cliente-lista/:idLoja", DashboardGerente.listaDadosGeralGerenteClienteLista);
router.get("/dashboard/lista-dashboard-gerente-cliente-lista-detalhes/:idLoja/:cliente", DashboardGerente.listaDadosGeralGerenteClienteListaDetalhe);

// ---------------------- POR GERENTE X INDICADOR RANKING --------------------
router.get("/dashboard/lista-dashboard-gerente-vendedor-lista/:idLoja", DashboardGerente.listaDadosGeralGerenteVendedoresLista);
router.get("/dashboard/lista-dashboard-gerente-vendedor-lista-detalhes/:idLoja/:vendedor", DashboardGerente.listaDadosGeralGerenteVendedoresListaDetalhe);


// ---------------------- POR GERENTE X INDICADOR RANKING --------------------
router.get("/dashboard/lista-dashboard-gerente-indicador-lista/:idLoja", DashboardGerente.listaDadosGerenteIndicadorLista);

module.exports = router; 