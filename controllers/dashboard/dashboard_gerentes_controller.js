const pg = require("../../conexao_jm");
const pg_jmonte_prod = require("../../conexao_jmonte_prod");
const moment = require("moment");

const limiteRegistros = 1000;
const limiteValor = 100;

exports.somaGeralRegistros = async (req, res) => {
  let idLoja = req.params.idLoja;

  let sqlContagemGeralPedidos = `select 
            COUNT(distinct(ec.np)) AS somaGeralPedidos  
        FROM 
            entregas_contatos ec where ec.status = 'Pendente' 
        AND 
             ec.codloja = $1
        AND 
            ec.cod_cliente_pre <> '00003404'
        AND 
            ec.cod_cliente_pre <> '7000407'
        AND 
            ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE
        HAVING 
            SUM(ec.vlr_total) > $2`;

  let rs;
  try {
    rs = await pg.execute(sqlContagemGeralPedidos, [idLoja, limiteValor]);

    let somaGeralPedidos = rs.rows.length > 0 ? rs.rows[0].somageralpedidos : 0;
    const response = {
      soma_geral_pedidos: somaGeralPedidos,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.somaGeralValores = async (req, res) => {
  console.log("******** contagemGeralValores Gerente *********");

  let idLoja = req.params.idLoja;

  let sqlContagemGeralValores = `select 
           SUM(ec.vlr_total) AS somaGeralValores 
        FROM 
            entregas_contatos ec where ec.status = 'Pendente' 
        AND 
             ec.codloja = $1
        AND 
            ec.cod_cliente_pre <> '00003404'
        AND 
            ec.cod_cliente_pre <> '7000407'
        AND 
            ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE
        HAVING 
            SUM(ec.vlr_total) > $2`;

  let rs;
  try {
    rs = await pg.execute(sqlContagemGeralValores, [idLoja, limiteValor]);

    console.log(rs.rows[0]);
    let somaGeralValores = rs.rows.length > 0 ? rs.rows[0].somageralvalores : 0;
    console.log(somaGeralValores);

    const response = {
      soma_geral_valores: somaGeralValores,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaDadosGeralGerenteHoje = async (req, res) => {
  let idLoja = req.params.idLoja;
  let sqlVendasPendentesDashVendedorGeralHoje = `SELECT 
                                                  SUM(ec.vlr_total) AS acumuladohoje  ,
                                                  COUNT(distinct(ec.np)) AS total_pedidos 
                                              FROM 
                                                  entregas_contatos ec 
                                              WHERE 
                                                  ec.status = 'Pendente' 
                                                  AND ec.cod_cliente_pre <> '00003404'
                                                  AND ec.cod_cliente_pre <> '7000407'
                                                  AND ec.codloja  = $1
                                                  AND ec.data_pre = CURRENT_DATE
                                                  HAVING 
                                                      SUM(ec.vlr_total) > $2`;
  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralHoje, [
      idLoja,
      limiteValor,
    ]);

    console.log(rs);

    let acumuladoHoje = rs.rows.length > 0 ? rs.rows[0].acumuladohoje : 0;
    let total_pedidos =
      rs.rows.length > 0 ? rs.rows[0].total_pedidos : 0;

    const response = {
      lista_um_hoje: acumuladoHoje,
      total_pedidos,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.listaDadosGeralGerenteDiaAnterior = async (req, res) => {
  let idLoja = req.params.idLoja;
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
            SUM(ec.vlr_total) AS acumuladoUmDia ,
            COUNT(distinct(ec.np)) AS total_pedidos 
        FROM 
            entregas_contatos ec 
        WHERE 
              ec.status = 'Pendente' 
        AND 
             ec.codloja  = $1
        AND 
            ec.cod_cliente_pre <> '00003404'
        AND 
            ec.cod_cliente_pre <> '7000407'
        AND 
            ec.data_pre  > CURRENT_DATE - INTERVAL '2 day'
        HAVING 
            SUM(ec.vlr_total) > $2`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idLoja,
      limiteValor,
    ]);

    let acumuladoDiaAnt = rs.rows.length > 0 ? rs.rows[0].acumuladoUmDia : 0;
    let total_pedidos = rs.rows.length > 0 ? rs.rows[0].total_pedidos : 0;

    const response = {
      lista_um_dia_vendedor: acumuladoDiaAnt,
      total_pedidos,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaDadosGeralGerenteSemanaAnterior = async (req, res) => {
  let idLoja = req.params.idLoja;
  let sqlVendasPendentesDashVendedorGeralSemanaAnterior = `select 
            SUM(ec.vlr_total) AS acumuladosemananterior  ,
            COUNT(distinct(ec.np)) AS total_pedidos
        FROM 
            entregas_contatos ec where ec.status = 'Pendente' 
        AND 
            ec.codloja = $1
        AND 
            ec.cod_cliente_pre <> '00003404'
        AND 
            ec.cod_cliente_pre <> '7000407'
        AND 
            ec.data_pre BETWEEN 
              DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
              AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'
        HAVING 
            SUM(ec.vlr_total) > $2`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralSemanaAnterior, [
      idLoja,
      limiteValor,
    ]);

    let acumuladoSemanaAnt =
      rs.rows.length > 0 ? rs.rows[0].acumuladosemananterior : 0;
    let total_pedidos = rs.rows.length > 0 ? rs.rows[0].total_pedidos : 0;
    const response = {
      lista_semana_anterior: acumuladoSemanaAnt,
      total_pedidos,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaDadosGeralGerenteMesAnterior = async (req, res) => {
  let idLoja = req.params.idLoja;
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
            SUM(ec.vlr_total) AS acumuladomesanterior  ,
            COUNT(distinct(ec.np)) AS total_pedidos
        FROM 
            entregas_contatos ec where ec.status = 'Pendente' 
        AND 
             ec.codloja = $1
        AND 
            ec.cod_cliente_pre <> '00003404'
        AND 
            ec.cod_cliente_pre <> '7000407'
        AND 
            ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
        AND 
            ec.data_pre < DATE_TRUNC('month', CURRENT_DATE)
        HAVING 
            SUM(ec.vlr_total) > $2`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idLoja,
      limiteValor,
    ]);

    let acumuladoSemanaAnt =
      rs.rows.length > 0 ? rs.rows[0].acumuladomesanterior : 0;
    let total_pedidos = rs.rows.length > 0 ? rs.rows[0].total_pedidos : 0;

    const response = {
      lista_mes_anterior: acumuladoSemanaAnt,
      total_pedidos,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaDadosGeralGerenteSeisMeses = async (req, res) => {
  let idLoja = req.params.idLoja;
  let sqlVendasPendentesDashVendedorGeralSeisMeses = `select 
            SUM(ec.vlr_total) AS acumuladoseismeses   ,
            COUNT(distinct(ec.np)) AS total_pedidos
        FROM 
            entregas_contatos ec where ec.status = 'Pendente' 
        AND 
             ec.codloja = $1
        AND 
            ec.cod_cliente_pre <> '00003404'
        AND 
            ec.cod_cliente_pre <> '7000407'
        AND 
            ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE
        HAVING 
            SUM(ec.vlr_total) > $2`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralSeisMeses, [
      idLoja,
      limiteValor,
    ]);

    let acumuladoSeisMeses =
      rs.rows.length > 0 ? rs.rows[0].acumuladoseismeses : 0;
    let total_pedidos = rs.rows.length > 0 ? rs.rows[0].total_pedidos : 0;
    const response = {
      lista_seis_meses: acumuladoSeisMeses,
      total_pedidos,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

///***************** genente x cliente detalhe *************/
exports.listaDadosGeralGerenteClienteLista = async (req, res) => {
  let idLoja = req.params.idLoja;
  let sqlLista = `SELECT 
                        ec.cod_cliente_pre,
                        LEFT(ec.cliente, 15) AS cliente,
                        SUM(ec.vlr_total) AS valorTotal
                    FROM 
                        entregas_contatos ec
                    WHERE 
                        ec.status = 'Pendente'
                        AND 
                            ec.codloja = $1
                        AND 
                            ec.cod_cliente_pre <> '00003404'
                        AND 
                            ec.cod_cliente_pre <> '7000407'
                        AND ec.data_pre > CURRENT_DATE - INTERVAL '180 days'
                    GROUP BY 
                        ec.cod_cliente_pre, ec.cliente
                    HAVING 
                      SUM(ec.vlr_total) > $3 
                    ORDER BY 
                        valorTotal DESC 
                    LIMIT $2`;

  try {
    let rs = await pg.execute(sqlLista, [idLoja, limiteRegistros, limiteValor]);
    const response = {
      lista_clientes_desc: rs.rows,
    };

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

///***************** genente x cliente detalhe *************/
exports.listaDadosGeralGerenteClienteListaDetalhe = async (req, res) => {
  let results = [];
  let cliente = req.params.cliente;
  let idLoja = req.params.idLoja;

  try {
    let detalhesUmDia = await listaPorClienteGerenteUmDia(idLoja, cliente);
    let detalhesSemanaAnterior = await listaPorClienteGerenteSemanaAnterior(
      idLoja,
      cliente
    );
    let detalhesMesAnterior = await listaPorClienteGerenteMesAnterior(
      idLoja,
      cliente
    );
    let detalhes180Dias = await listaPorClienteGerente180Dias(idLoja, cliente);

    // Consolidar os detalhes no resultado
    results.push({
      cliente: cliente,
      umDia: detalhesUmDia,
      semanaAnterior: detalhesSemanaAnterior,
      mesAnterior: detalhesMesAnterior,
      centoOitentaDias: detalhes180Dias,
    });

    const response = {
      lista_detalhes_cliente: results,
    };

    res.status(200).send(response);
  } catch (err) {
    console.error(`Erro ao buscar detalhes do cliente ${cliente}:`, err);
    results.push({
      ...rs.rows[i],
      umDia: null,
      semanaAnterior: null,
      mesAnterior: null,
      centoOitentaDias: null,
    });
  }
};

async function listaPorClienteGerenteUmDia(idloja, cod_cliente) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
            SUM(ec.vlr_total) AS acumulado  
        FROM 
            entregas_contatos ec WHERE ec.status = 'Pendente' 
        AND 
            ec.codloja = $1
        AND
            ec.cod_cliente_pre  = $2
        AND 
            ec.data_pre  > CURRENT_DATE - INTERVAL '2 day'
        HAVING 
            SUM(ec.vlr_total) > $3 `;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      cod_cliente,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorClienteGerenteSemanaAnterior(idloja, cod_cliente) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
            SUM(ec.vlr_total) AS acumulado  
        FROM 
            entregas_contatos ec WHERE ec.status = 'Pendente' 
        AND 
            ec.codloja = $1
        AND
            ec.cod_cliente_pre  = $2
        AND 
            ec.data_pre BETWEEN 
              DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
              AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'
        HAVING 
            SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      cod_cliente,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorClienteGerenteMesAnterior(idloja, cod_cliente) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
            SUM(ec.vlr_total) AS acumulado  
        FROM 
            entregas_contatos ec WHERE ec.status = 'Pendente' 
        AND 
            ec.codloja = $1
        AND
              ec.cod_cliente_pre  = $2
        AND 
            ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
        AND 
            ec.data_pre < DATE_TRUNC('month', CURRENT_DATE)
         HAVING 
            SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      cod_cliente,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorClienteGerente180Dias(idloja, cod_cliente) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
            SUM(ec.vlr_total) AS acumulado  
        FROM 
            entregas_contatos ec WHERE ec.status = 'Pendente' 
        AND 
            ec.codloja = $1
        AND
            ec.cod_cliente_pre  = $2
        AND 
            ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE
        HAVING 
            SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      cod_cliente,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

/// ************ gerentes x vendedores ******************

exports.listaDadosGeralGerenteVendedoresLista = async (req, res) => {
  let idLoja = req.params.idLoja;
  let sqlLista = `SELECT 
                        ec.cod_vendedor_pre,
                        ec.vendedor  as nome,
                        SUM(ec.vlr_total) AS acumulado
                    FROM 
                        entregas_contatos ec
                    WHERE 
                        ec.status = 'Pendente'
                        AND 
                            ec.codloja = $1
                        AND 
                            ec.cod_cliente_pre <> '00003404'
                        AND 
                            ec.cod_cliente_pre <> '7000407'
                        AND ec.data_pre > CURRENT_DATE - INTERVAL '180 days'
                    GROUP BY 
                        ec.cod_vendedor_pre, ec.vendedor
                    HAVING 
                        SUM(ec.vlr_total) > $3
                    ORDER BY 
                        acumulado DESC 
                    LIMIT $2`;

  try {
    let rs = await pg.execute(sqlLista, [idLoja, limiteRegistros, limiteValor]);
    const response = {
      lista_vendedores_desc: rs.rows,
    };

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaDadosGeralGerenteVendedoresListaDetalhe = async (req, res) => {
  let results = [];
  let vendedor = req.params.vendedor;
  let idLoja = req.params.idLoja;

  try {
    // Obter detalhes para diferentes períodos
    let detalhesUmDia = await listaPorVendedorGerenteUmDia(idLoja, vendedor);
    let detalhesSemanaAnterior = await listaPorVendedorGerenteSemanaAnterior(
      idLoja,
      vendedor
    );
    let detalhesMesAnterior = await listaPorVendedorGerenteMesAnterior(
      idLoja,
      vendedor
    );
    let detalhes180Dias = await listaPorVendedorGerente180Dias(
      idLoja,
      vendedor
    );

    // Consolidar os detalhes no resultado
    results.push({
      vendedor: vendedor,
      umDia: detalhesUmDia,
      semanaAnterior: detalhesSemanaAnterior,
      mesAnterior: detalhesMesAnterior,
      centoOitentaDias: detalhes180Dias,
    });

    const response = {
      lista_detalhes_vendedores: results,
    };

    res.status(200).send(response);
  } catch (err) {
    console.error(`Erro ao buscar detalhes do cliente ${vendedor}:`, err);
    results.push({
      ...rs.rows[i],
      umDia: null,
      semanaAnterior: null,
      mesAnterior: null,
      centoOitentaDias: null,
    });
  }
};

//************ DETALHES GERENTE X VENDEDORES  *******************/
async function listaPorVendedorGerenteUmDia(idloja, vendedor) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
              SUM(ec.vlr_total) AS acumulado  
          FROM 
              entregas_contatos ec WHERE ec.status = 'Pendente' 
          AND 
              ec.codloja = $1
          AND
              ec.cod_vendedor_pre  = $2
          AND 
              ec.cod_cliente_pre <> '00003404'
          AND 
              ec.cod_cliente_pre <> '7000407'
          AND 
              ec.data_pre  > CURRENT_DATE - INTERVAL '2 day'
          HAVING 
              SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      vendedor,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorVendedorGerenteSemanaAnterior(idloja, vendedor) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
              SUM(ec.vlr_total) AS acumulado  
          FROM 
              entregas_contatos ec WHERE ec.status = 'Pendente' 
          AND 
              ec.codloja = $1
          AND
              ec.cod_vendedor_pre  = $2
          AND 
              ec.cod_cliente_pre <> '00003404'
          AND 
              ec.cod_cliente_pre <> '7000407'
          AND 
              ec.data_pre BETWEEN 
                DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
                AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'
           HAVING 
              SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      vendedor,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorVendedorGerenteMesAnterior(idloja, vendedor) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
              SUM(ec.vlr_total) AS acumulado  
          FROM 
              entregas_contatos ec WHERE ec.status = 'Pendente' 
          AND 
              ec.codloja = $1
          AND
              ec.cod_vendedor_pre = $2
          AND 
            ec.cod_cliente_pre <> '00003404'
          AND 
              ec.cod_cliente_pre <> '7000407'
          AND 
              ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
          AND 
              ec.data_pre < DATE_TRUNC('month', CURRENT_DATE)
           HAVING 
              SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      vendedor,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorVendedorGerente180Dias(idloja, vendedor) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
              SUM(ec.vlr_total) AS acumulado  
          FROM 
              entregas_contatos ec WHERE ec.status = 'Pendente' 
          AND 
              ec.codloja = $1
          AND
              ec.cod_vendedor_pre  = $2
          AND 
              ec.cod_cliente_pre <> '00003404'
          AND 
              ec.cod_cliente_pre <> '7000407'
          AND 
              ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE
          HAVING 
              SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      vendedor,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

///gernte x indicador

exports.listaDadosGerenteIndicadorLista = async (req, res) => {
  let idLoja = req.params.idLoja;
  let sqlLista = `
    SELECT 
        ec.cod_indica_pre, 
        SUM(ec.vlr_total) AS valortotal
    FROM 
        entregas_contatos ec
    WHERE 
        TRIM(ec.cod_indica_pre) <> '' 
        AND 
            ec.codloja = $1
        AND 
            ec.status = 'Pendente'
        AND 
            ec.cod_cliente_pre <> '00003404'
          AND 
              ec.cod_cliente_pre <> '7000407'
        AND 
            ec.data_pre > CURRENT_DATE - INTERVAL '180 days'
    GROUP BY 
        ec.cod_indica_pre
    HAVING 
        SUM(ec.vlr_total) > $3
    ORDER BY 
        valortotal DESC 
    LIMIT $2`;

  try {
    let rs = await pg.execute(sqlLista, [idLoja, limiteRegistros, limiteValor]);

    // Para cada indicador, buscar o nome associado
    let listaResultados = [];
    for (let i = 0; i < rs.rows.length; i++) {
      let codIndica = rs.rows[i].cod_indica_pre;

      // Consulta para obter o nome do indicador
      let sqlInd = `SELECT SUBSTRING(i.indicador FROM 1 FOR 15) AS indicador
                    FROM vs_pwb_dindicadores i 
                    WHERE i.cod_indica = $1`;

      let rsInd = await pg_jmonte_prod.execute(sqlInd, [codIndica]);

      // Adicionar os dados ao resultado final
      listaResultados.push({
        cod_indica_pre: codIndica,
        indicador: rsInd.rows.length > 0 ? rsInd.rows[0].indicador : null,
        valorTotal: rs.rows[i].valortotal,
      });
    }

    // Retornar os dados no formato esperado
    const response = {
      lista_indicadores_desc: listaResultados,
    };

    res.status(200).send(response);
  } catch (error) {
    console.error(
      "Erro ao executar listaDadosGeralVendedorIndicadorLista:",
      error
    );
    return res
      .status(404)
      .send({ error: error, mensagem: "Erro ao procurar os dados." });
  }
};

exports.listaDadosGerenteIndicadorListaDetalhe = async (req, res) => {
  let results = [];
  let indicador = req.params.indicador;
  let idLoja = req.params.idLoja;

  try {
    // Obter detalhes para diferentes períodos
    let detalhesUmDia = await listaPorIndicadorGerenteUmDia(idLoja, indicador);
    let detalhesSemanaAnterior = await listaPorIndicadorGerenteSemanaAnterior(
      idLoja,
      indicador
    );
    let detalhesMesAnterior = await listaPorIndicadorGerenteMesAnterior(
      idLoja,
      indicador
    );
    let detalhes180Dias = await listaPorIndicadorGerente180Dias(
      idLoja,
      indicador
    );

    // Consolidar os detalhes no resultado
    results.push({
      indicador: indicador,
      umDia: detalhesUmDia,
      semanaAnterior: detalhesSemanaAnterior,
      mesAnterior: detalhesMesAnterior,
      centoOitentaDias: detalhes180Dias,
    });

    const response = {
      lista_detalhes_indicadores: results,
    };

    res.status(200).send(response);
  } catch (err) {
    console.error(`Erro ao buscar detalhes do cliente ${indicador}:`, err);
    results.push({
      ...rs.rows[i],
      umDia: null,
      semanaAnterior: null,
      mesAnterior: null,
      centoOitentaDias: null,
    });
  }
};

async function listaPorIndicadorGerenteUmDia(idLoja, indicador) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec WHERE ec.status = 'Pendente' 
      AND 
          ec.codloja = $1
      AND 
            ec.cod_cliente_pre <> '00003404'
          AND 
              ec.cod_cliente_pre <> '7000407'
      AND
        TRIM(ec.cod_indica_pre) = $2
      AND 
          ec.data_pre  > CURRENT_DATE - INTERVAL '2 day'
      HAVING 
        SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idLoja,
      indicador,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorIndicadorGerenteSemanaAnterior(idLoja, indicador) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.codloja = $1
      AND 
            ec.cod_cliente_pre <> '00003404'
          AND 
              ec.cod_cliente_pre <> '7000407'
      AND
          TRIM(ec.cod_indica_pre)  = $2
      AND 
          ec.data_pre BETWEEN 
            DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
            AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'
      HAVING 
          SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idLoja,
      indicador,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorIndicadorGerenteMesAnterior(idLoja, indicador) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.codloja = $1
      AND 
            ec.cod_cliente_pre <> '00003404'
          AND 
              ec.cod_cliente_pre <> '7000407'
      AND
         TRIM(ec.cod_indica_pre)  = $2
      AND 
          ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND 
          ec.data_pre < DATE_TRUNC('month', CURRENT_DATE)
      HAVING 
          SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idLoja,
      indicador,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorIndicadorGerente180Dias(idLoja, cod_cliente) {
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.codloja = $1
      AND 
            ec.cod_cliente_pre <> '00003404'
          AND 
              ec.cod_cliente_pre <> '7000407'
      AND
          TRIM(ec.cod_indica_pre)  = $2
      AND 
          ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE
      HAVING 
          SUM(ec.vlr_total) > $3`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idLoja,
      cod_cliente,
      limiteValor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

exports.listaDadosGerenteGeralNps = async (req, res) => {
  let periodo = req.params.periodo;
  let idLoja = req.params.idLoja;
  let sqlSelecionado = "";
  if (periodo == "HOJE") {
    sqlSelecionado = " AND ec.data_pre = CURRENT_DATE ";
  }
  if (periodo == "DIA ANT.") {
    sqlSelecionado = " AND ec.data_pre  > CURRENT_DATE - INTERVAL '2 day' ";
  }
  if (periodo == "SEMANA ANT.") {
    sqlSelecionado = ` AND ec.data_pre BETWEEN 
            DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
            AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day' `;
  }
  if (periodo == "MÊS ANT.") {
    sqlSelecionado = ` AND 
          ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND 
          ec.data_pre < DATE_TRUNC('month', CURRENT_DATE) `;
  }
  if (periodo == "180 DIAS") {
    sqlSelecionado =
      " AND  ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE ";
  }

  let sql = `SELECT 
                ec.np,
                SUBSTRING(ec.cliente FROM 1 FOR 15) AS cliente,
                SUM(ec.vlr_total) AS acumulado
            FROM 
                entregas_contatos ec
            WHERE 
                ec.status = 'Pendente'
            AND 
                ec.codloja = $1
            AND 
                ec.cod_cliente_pre <> '00003404'
            AND 
                ec.cod_cliente_pre <> '7000407'
            ${sqlSelecionado}
            GROUP BY 
                ec.np, ec.cliente
            HAVING 
                SUM(ec.vlr_total) > $2
            ORDER BY 
                acumulado DESC`;
  let rs;
  try {
    rs = await pg.execute(sql, [idLoja, limiteValor]);

    const response = {
      lista_nps_cliente: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
