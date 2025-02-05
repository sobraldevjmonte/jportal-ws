const { diffieHellman } = require("crypto");
const pg = require("../../conexao_jm");
const pg_jmonte_prod = require("../../conexao_jmonte_prod");
const moment = require("moment");

const limiteRegistros = 1000;
const limiteValor = 100;

exports.listaDadosGeralVendedorSeisMeses = async (req, res) => {
  console.log("******** listaDadosGeralVendedorSeisMeses *********");

  let codigoVendedor = req.params.idVendedor;

  let sqlVendasPendentesDashVendedorGeralSeisMeses = `select 
          SUM(ec.vlr_total) AS acumuladoSeisMeses  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND 
        ec.cod_cliente_pre <> '00003404'
      AND 
          ec.cod_cliente_pre <> '7000407'
      AND 
          ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralSeisMeses, [
      codigoVendedor,
    ]);

    console.log(rs.rows[0]);

    const response = {
      lista_seis_meses: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.listaDadosGeralVendedorMesAnterior = async (req, res) => {
  console.log("******** listaDadosGeralVendedorMesAnterior *********");

  let codigoVendedor = req.params.idVendedor;
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumuladoMesAnterior  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND 
        ec.cod_cliente_pre <> '00003404'
      AND 
          ec.cod_cliente_pre <> '7000407'
      AND 
          ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND 
          ec.data_pre < DATE_TRUNC('month', CURRENT_DATE)`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      codigoVendedor,
    ]);

    const response = {
      lista_mes_ant_vendedor: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.listaDadosGeralVendedorSemanaAnterior = async (req, res) => {
  console.log("******** listaDadosGeralVendedorSemanaAnterior *********");

  let codigoVendedor = req.params.idVendedor;

  let sqlVendasPendentesDashVendedorGeralSemanaAnterior = `select 
          SUM(ec.vlr_total) AS acumuladoSemanAnterior  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND 
        ec.cod_cliente_pre <> '00003404'
      AND 
          ec.cod_cliente_pre <> '7000407'
      AND 
          ec.data_pre BETWEEN 
            DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
            AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralSemanaAnterior, [
      codigoVendedor,
    ]);

    const response = {
      lista_semana_anterior: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.listaDadosGeralVendedorHoje = async (req, res) => {
  console.log("******** listaDadosGeralVendedorHoje *********");

  let codigoVendedor = req.params.idVendedor;

  let sqlVendasPendentesDashVendedorGeralHoje = `SELECT 
                                                  SUM(ec.vlr_total) AS acumuladohoje  
                                              FROM 
                                                  entregas_contatos ec 
                                              WHERE 
                                                  ec.status = 'Pendente' 
                                                  AND 
                                                    ec.cod_cliente_pre <> '00003404'
                                                  AND 
                                                      ec.cod_cliente_pre <> '7000407'
                                                  AND ec.cod_vendedor_pre = $1
                                                  AND ec.data_pre = CURRENT_DATE
                                              `;

  console.log(sqlVendasPendentesDashVendedorGeralHoje);
  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralHoje, [
      codigoVendedor,
    ]);

    console.log(rs);
    const response = {
      lista_hoje_vendedor: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.listaDadosGeralVendedorDiaAnterior = async (req, res) => {
  console.log("******** listaDadosGeralVendedorDiaAnterior *********");

  let codigoVendedor = req.params.idVendedor;

  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumuladoUmDia  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND 
          ec.cod_cliente_pre <> '00003404'
      AND 
          ec.cod_cliente_pre <> '7000407'
      AND 
          ec.data_pre  > CURRENT_DATE - INTERVAL '2 day'`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      codigoVendedor,
    ]);

    const response = {
      lista_um_dia_vendedor: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

//*************** vendedore x cliente *************/
exports.listaDadosGeralVendedorClienteLista = async (req, res) => {
  console.log("******** listaDadosGeralVendedorClienteLista *********");

  let codigoVendedor = req.params.idVendedor;

  let sqlLista = `SELECT 
                      ec.cod_cliente_pre,
                      LEFT(ec.cliente, 15) AS cliente,
                      SUM(ec.vlr_total) AS valorTotal
                  FROM 
                      entregas_contatos ec
                  WHERE 
                      ec.status = 'Pendente'
                      AND 
                        ec.cod_vendedor_pre = $1
                      AND 
                        ec.vlr_total > $3
                      AND 
                        ec.cod_cliente_pre <> '00003404'
                      AND 
                          ec.cod_cliente_pre <> '7000407'
                      AND ec.data_pre > CURRENT_DATE - INTERVAL '180 days'
                  GROUP BY 
                      ec.cod_cliente_pre, ec.cliente 
                  ORDER BY 
                      valorTotal DESC 
                  LIMIT $2`;

  try {
    let rs = await pg.execute(sqlLista, [
      codigoVendedor,
      limiteRegistros,
      limiteValor,
    ]);
    const response = {
      lista_clientes_desc: rs.rows,
    };

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

//*************** vendedore x cliente detalhes *************/
exports.listaDadosGeralVendedorClienteListaDetalhe = async (req, res) => {
  console.log("******** listaDadosGeralVendedorClienteListaDetalhe *********");

  let results = [];
  let cliente = req.params.cliente;
  let codigoVendedor = req.params.vendedor;

  console.log("********************************");
  console.log(cliente, codigoVendedor);
  console.log(req.params);
  console.log("********************************");

  // for (let i = 0; i < rs.rows.length; i++) {
  // let cliente = rs.rows[i].cod_cliente_pre;

  try {
    // Obter detalhes para diferentes períodos
    let detalhesUmDia = await listaPorClienteUmDia(codigoVendedor, cliente);
    let detalhesSemanaAnterior = await listaPorClienteSemanaAnterior(
      codigoVendedor,
      cliente
    );
    let detalhesMesAnterior = await listaPorClienteMesAnterior(
      codigoVendedor,
      cliente
    );
    let detalhes180Dias = await listaPorCliente180Dias(codigoVendedor, cliente);

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

    console.log(response);
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

async function listaPorClienteUmDia(vendedor, cod_cliente) {
  console.log("******** listaPorVendedorClienteUmDia *********");

  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND
      	ec.cod_cliente_pre  = $2
      AND 
          ec.data_pre  > CURRENT_DATE - INTERVAL '2 day'`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      vendedor,
      cod_cliente,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorClienteSemanaAnterior(vendedor, cod_cliente) {
  console.log("******** listaPorVendedorClienteSemanaAnterior *********");
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND
      	  ec.cod_cliente_pre  = $2
      AND 
          ec.data_pre BETWEEN 
            DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
            AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      vendedor,
      cod_cliente,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorClienteMesAnterior(vendedor, cod_cliente) {
  console.log("******** listaPorVendedorClienteMesAnterior *********");
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND
      	  ec.cod_cliente_pre  = $2
      AND 
          ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND 
          ec.data_pre < DATE_TRUNC('month', CURRENT_DATE)`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      vendedor,
      cod_cliente,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorCliente180Dias(vendedor, cod_cliente) {
  console.log("******** listaPorVendedorCliente180Dias *********");
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND
      	  ec.cod_cliente_pre  = $2
      AND 
          ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      vendedor,
      cod_cliente,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

//********************* vendedor x indicadores *******/

exports.listaDadosGeralVendedorIndicadorLista = async (req, res) => {
  console.log("******** listaDadosGeralVendedorIndicadorLista *********");

  let codigoVendedor = req.params.idVendedor;

  // Consulta para obter os indicadores e os valores totais
  let sqlLista = `
    SELECT 
        ec.cod_indica_pre, 
        SUM(ec.vlr_total) AS valortotal
    FROM 
        entregas_contatos ec
    WHERE 
        TRIM(ec.cod_indica_pre) <> '' 
        AND ec.cod_vendedor_pre = $1
        AND ec.status = 'Pendente'
         AND 
          ec.vlr_total > $3
        AND 
          ec.cod_cliente_pre <> '00003404'
        AND 
            ec.cod_cliente_pre <> '7000407'
        AND ec.data_pre > CURRENT_DATE - INTERVAL '180 days'
    GROUP BY 
        ec.cod_indica_pre
    ORDER BY 
        valortotal DESC 
    LIMIT $2`;

  try {
    let rs = await pg.execute(sqlLista, [
      codigoVendedor,
      limiteRegistros,
      limiteValor,
    ]);

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

exports.listaDadosGeralVendedorIndicadorListaDetalhe = async (req, res) => {
  console.log("******** listaDadosGeralVendedorClienteListaDetalhe *********");

  let results = [];
  let indicador = req.params.indicador;
  let codigoVendedor = req.params.vendedor;

  console.log("********************************");
  console.log(indicador, codigoVendedor);
  console.log(req.params);
  console.log("********************************");

  // for (let i = 0; i < rs.rows.length; i++) {
  // let cliente = rs.rows[i].cod_cliente_pre;

  try {
    // Obter detalhes para diferentes períodos
    let detalhesUmDia = await listaPorIndicadorUmDia(codigoVendedor, indicador);
    let detalhesSemanaAnterior = await listaPorIndicadorSemanaAnterior(
      codigoVendedor,
      indicador
    );
    let detalhesMesAnterior = await listaPorIndicadorMesAnterior(
      codigoVendedor,
      indicador
    );
    let detalhes180Dias = await listaPorIndicador180Dias(
      codigoVendedor,
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
      lista_detalhes_indicador: results,
    };

    console.log(response);
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

// **************** lista vendedor x indicador detalhes ****************
async function listaPorIndicadorUmDia(vendedor, indicador) {
  console.log("******** listaPorIndicadorUmDia *********");

  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec WHERE ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND 
        ec.cod_cliente_pre <> '00003404'
      AND 
          ec.cod_cliente_pre <> '7000407'
      AND
      	TRIM(ec.cod_indica_pre) = $2
      AND 
          ec.data_pre  > CURRENT_DATE - INTERVAL '2 day'`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      vendedor,
      indicador,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorIndicadorSemanaAnterior(vendedor, indicador) {
  console.log("******** listaPorIndicadorSemanaAnterior *********");
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND 
          ec.cod_cliente_pre <> '00003404'
      AND 
          ec.cod_cliente_pre <> '7000407'
      AND
      	  TRIM(ec.cod_indica_pre)  = $2
      AND 
          ec.data_pre BETWEEN 
            DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
            AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      vendedor,
      indicador,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorIndicadorMesAnterior(vendedor, indicador) {
  console.log("******** listaPorIndicadorMesAnterior *********");
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND 
          ec.cod_cliente_pre <> '00003404'
      AND 
          ec.cod_cliente_pre <> '7000407'
      AND
      	 TRIM(ec.cod_indica_pre)  = $2
      AND 
          ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND 
          ec.data_pre < DATE_TRUNC('month', CURRENT_DATE)`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      vendedor,
      indicador,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorIndicador180Dias(vendedor, cod_cliente) {
  console.log("******** listaPorIndicador180Dias *********");
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
          SUM(ec.vlr_total) AS acumulado  
      FROM 
          entregas_contatos ec where ec.status = 'Pendente' 
      AND 
          ec.cod_vendedor_pre = $1
      AND 
          ec.cod_cliente_pre <> '00003404'
      AND 
          ec.cod_cliente_pre <> '7000407'
      AND
      	  TRIM(ec.cod_indica_pre)  = $2
      AND 
          ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE`;

  let rs;
  console.log(sqlVendasPendentesDashVendedorGeralDiaAnterior);
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      vendedor,
      cod_cliente,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

//// vendedor x clientes x nps

exports.listaDadosVendedorClientesNps = async (req, res) => {
  console.log("******** listaDadosVendedorClientesNps *********");

  let idCliente = req.params.idCliente;
  let idVendedor = req.params.idVendedor;
  let idLoja = req.params.idLoja;
  console.log(idCliente, idVendedor, idLoja);

  let sql = `SELECT 
                ec.np,
                ec.cliente ,
                SUM(ec.vlr_total) AS acumulado
            FROM 
                entregas_contatos ec
            WHERE 
                ec.status = 'Pendente'
            AND 
                ec.codloja = $1
            AND 
                ec.cod_cliente_pre = $2
            AND
              ec.cod_vendedor_pre = $3
            AND 
                ec.cod_cliente_pre <> '00003404'
            AND 
                ec.cod_cliente_pre <> '7000407'
            GROUP BY 
                ec.np, ec.cliente
            ORDER BY 
                acumulado DESC`;
  console.log(sql);
  let rs;
  try {
    rs = await pg.execute(sql, [idLoja, idCliente, idVendedor]);

    console.log(rs.rows[0]);

    const response = {
      lista_nps_cliente: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

//// gerente x clientes x nps

exports.listaDadosGerenteClientesNps = async (req, res) => {
  console.log("******** listaDadosVendedorClientesNps *********");

  let idCliente = req.params.idCliente;
  let idLoja = req.params.idLoja;
  console.log(idCliente, idLoja);

  let sql = `SELECT 
                ec.np,
                ec.cliente ,
                SUM(ec.vlr_total) AS acumulado,
                ec.vendedor 
            FROM 
                entregas_contatos ec
            WHERE 
                ec.status = 'Pendente'
            AND 
                ec.codloja = $1
            AND 
                ec.cod_cliente_pre = $2
            AND 
                ec.cod_cliente_pre <> '00003404'
            AND 
                ec.cod_cliente_pre <> '7000407'
            GROUP BY 
                ec.np, ec.cliente, ec.vendedor 
            ORDER BY 
                acumulado DESC`;
  console.log(sql);
  let rs;
  try {
    rs = await pg.execute(sql, [idLoja, idCliente]);

    console.log(rs.rows[0]);

    const response = {
      lista_nps_cliente: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaDadosVendedorGeralNps = async (req, res) => {
  console.log("******** listaDadosVendedorClientesNps *********");

  let periodo = req.params.periodo;
  let idVendedor = req.params.idVendedor;
  let idLoja = req.params.idLoja;
  console.log('periodo: ' + periodo, 'idVendedor: ' + idVendedor , 'idLoja' + idLoja);

  let sqlSelecionado = "";
  if ((periodo == "HOJE")) {
    sqlSelecionado = " AND ec.data_pre = CURRENT_DATE ";
  }
  if ((periodo == "DIA ANT.")) {
    sqlSelecionado = " AND ec.data_pre  > CURRENT_DATE - INTERVAL '2 day' ";
  }
  if ((periodo == "SEMANA ANT.")) {
    sqlSelecionado = ` AND ec.data_pre BETWEEN 
            DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
            AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day' `;
  }
  if ((periodo == "MÊS ANT.")) {
    sqlSelecionado = ` AND 
          ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND 
          ec.data_pre < DATE_TRUNC('month', CURRENT_DATE) `;
  }
  if ((periodo == "180 DIAS")) {
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
              ec.cod_vendedor_pre = $2
            AND 
                ec.cod_cliente_pre <> '00003404'
            AND 
                ec.cod_cliente_pre <> '7000407'
            ${sqlSelecionado}
            GROUP BY 
                ec.np, ec.cliente
            ORDER BY 
                acumulado DESC`;
  console.log(sql);
  let rs;
  try {
    rs = await pg.execute(sql, [idLoja, idVendedor]);

    console.log(rs.rows[0]);

    const response = {
      lista_nps_cliente: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
