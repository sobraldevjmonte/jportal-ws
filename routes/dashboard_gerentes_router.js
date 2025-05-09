const express = require("express");
const router = express.Router();
const DashboardGerente = require("../controllers/dashboard/dashboard_gerentes_controller");


//******************************** gerentes *********************************/
//******************************** gerentes *********************************/
//******************************** gerentes *********************************/

//-------------------------- POR GERENTE GERAL --------------------------------
router.get("/dashboard/lista-dashboard-gerente-geral-hoje/:idLoja", DashboardGerente.listaDadosGeralGerenteHoje);
router.get("/dashboard/lista-dashboard-gerente-geral-um-dia/:idLoja", DashboardGerente.listaDadosGeralGerenteDiaAnterior);
router.get("/dashboard/lista-dashboard-gerente-geral-semana-anterior/:idLoja", DashboardGerente.listaDadosGeralGerenteSemanaAnterior);
router.get("/dashboard/lista-dashboard-gerente-geral-mes-anterior/:idLoja", DashboardGerente.listaDadosGeralGerenteMesAnterior);
router.get("/dashboard/lista-dashboard-gerente-geral-seis-meses/:idLoja", DashboardGerente.listaDadosGeralGerenteSeisMeses);

//******** contagem geral registros/valores gerente dashboard  ***********/
router.get("/dashboard/soma-geral-registros-gerente/:idLoja", DashboardGerente.somaGeralRegistros);
router.get("/dashboard/soma-geral-valores-gerente/:idLoja", DashboardGerente.somaGeralValores);


// ---------------------- POR GERENTE X CLIENTES RANKING --------------------
router.get("/dashboard/lista-dashboard-gerente-cliente-lista/:idLoja", DashboardGerente.listaDadosGeralGerenteClienteLista);
router.get("/dashboard/lista-dashboard-gerente-cliente-lista-detalhes/:idLoja/:cliente", DashboardGerente.listaDadosGeralGerenteClienteListaDetalhe);

// ---------------------- POR GERENTE X INDICADOR RANKING --------------------
router.get("/dashboard/lista-dashboard-gerente-vendedor-lista/:idLoja", DashboardGerente.listaDadosGeralGerenteVendedoresLista);
router.get("/dashboard/lista-dashboard-gerente-vendedor-lista-detalhes/:idLoja/:vendedor", DashboardGerente.listaDadosGeralGerenteVendedoresListaDetalhe);


// ---------------------- POR GERENTE X INDICADOR RANKING --------------------
router.get("/dashboard/lista-dashboard-gerente-indicador-lista/:idLoja", DashboardGerente.listaDadosGerenteIndicadorLista);
router.get("/dashboard/lista-dashboard-gerente-indicador-lista-detalhes/:idLoja/:indicador", DashboardGerente.listaDadosGerenteIndicadorListaDetalhe);



//-------------------------- LSITA NP POR VENDEDOR GERAL-----------------------------
router.get("/dashboard/lista-dashboard-nps-gerente-nps-geral-hoje/:idLoja/:periodo", DashboardGerente.listaDadosGerenteGeralNps);

module.exports = router; 