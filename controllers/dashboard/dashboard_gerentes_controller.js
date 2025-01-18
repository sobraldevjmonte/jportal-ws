const pg = require("../../conexao_jm");
const pg_jmonte_prod = require("../../conexao_jmonte_prod");
const moment = require("moment");

const limiteRegistros = 5;

exports.listaDadosGeralGerenteDiaAnterior = async (req, res) => {
  console.log("******** listaDadosGeralVendedorDiaAnterior *********");

  let idLoja = req.params.idLoja;
  console.log(idLoja);
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
            SUM(ec.vlr_total) AS acumuladoUmDia  
        FROM 
            entregas_contatos ec where ec.status = 'Pendente' 
        AND 
             ec.codloja  = $1
        AND 
            ec.data_pre  > CURRENT_DATE - INTERVAL '2 day'`;

  console.log(sqlVendasPendentesDashVendedorGeralDiaAnterior);
  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idLoja,
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

exports.listaDadosGeralGerenteSemanaAnterior = async (req, res) => {
  console.log("******** listaDadosGeralVendedorSemanaAnterior *********");

  let idLoja = req.params.idLoja;

  let sqlVendasPendentesDashVendedorGeralSemanaAnterior = `select 
            SUM(ec.vlr_total) AS acumuladoSemanAnterior  
        FROM 
            entregas_contatos ec where ec.status = 'Pendente' 
        AND 
            ec.codloja = $1
        AND 
            ec.data_pre BETWEEN 
              DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
              AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'`;

  console.log(sqlVendasPendentesDashVendedorGeralSemanaAnterior);
  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralSemanaAnterior, [
      idLoja,
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

exports.listaDadosGeralGerenteMesAnterior = async (req, res) => {
  console.log("******** listaDadosGeralVendedorMesAnterior *********");

  let idLoja = req.params.idLoja;
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
            SUM(ec.vlr_total) AS acumuladoMesAnterior  
        FROM 
            entregas_contatos ec where ec.status = 'Pendente' 
        AND 
             ec.codloja = $1
        AND 
            ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
        AND 
            ec.data_pre < DATE_TRUNC('month', CURRENT_DATE)`;

  console.log(sqlVendasPendentesDashVendedorGeralDiaAnterior);
  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idLoja,
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

exports.listaDadosGeralGerenteSeisMeses = async (req, res) => {
  console.log("******** listaDadosGeralVendedorSeisMeses *********");

  let idLoja = req.params.idLoja;

  let sqlVendasPendentesDashVendedorGeralSeisMeses = `select 
            SUM(ec.vlr_total) AS acumuladoSeisMeses  
        FROM 
            entregas_contatos ec where ec.status = 'Pendente' 
        AND 
             ec.codloja = $1
        AND 
            ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE`;

  console.log(sqlVendasPendentesDashVendedorGeralSeisMeses);
  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralSeisMeses, [
      idLoja,
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

///***************** genente x cliente detalhe *************/
exports.listaDadosGeralGerenteClienteLista = async (req, res) => {
  console.log("******** listaDadosGeralVendedorClienteLista *********");

  let idLoja = req.params.idLoja;

  let sqlLista = `SELECT 
                        ec.cod_cliente_pre,
                        LEFT(ec.cliente, 15) AS cliente,
                        SUM(ec.vlr_total) AS valorTotal
                    FROM 
                        entregas_contatos ec
                    WHERE 
                        ec.status = 'Pendente'
                        AND ec.codloja = $1
                        and ec.cod_cliente_pre <> '00003404'
                        AND ec.data_pre > CURRENT_DATE - INTERVAL '180 days'
                    GROUP BY 
                        ec.cod_cliente_pre, ec.cliente 
                    ORDER BY 
                        valorTotal DESC 
                    LIMIT $2`;

  try {
    let rs = await pg.execute(sqlLista, [idLoja, limiteRegistros]);
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
  console.log("******** listaDadosGeralVendedorClienteListaDetalhe *********");

  let results = [];
  let cliente = req.params.cliente;
  let idLoja = req.params.idLoja;

  console.log("********************************");
  console.log(cliente, idLoja);
  console.log(req.params);
  console.log("********************************");

  // for (let i = 0; i < rs.rows.length; i++) {
  // let cliente = rs.rows[i].cod_cliente_pre;

  try {
    // Obter detalhes para diferentes períodos
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

async function listaPorClienteGerenteUmDia(idloja, cod_cliente) {
  console.log("******** listaPorVendedorClienteUmDia *********");

  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
            SUM(ec.vlr_total) AS acumulado  
        FROM 
            entregas_contatos ec WHERE ec.status = 'Pendente' 
        AND 
            ec.codloja = $1
        AND
              ec.cod_cliente_pre  = $2
        AND 
            ec.data_pre  > CURRENT_DATE - INTERVAL '2 day'`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      cod_cliente,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorClienteGerenteSemanaAnterior(idloja, cod_cliente) {
  console.log("******** listaPorVendedorClienteSemanaAnterior *********");
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
              AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      cod_cliente,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorClienteGerenteMesAnterior(idloja, cod_cliente) {
  console.log("******** listaPorVendedorClienteMesAnterior *********");
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
            ec.data_pre < DATE_TRUNC('month', CURRENT_DATE)`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      cod_cliente,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorClienteGerente180Dias(idloja, cod_cliente) {
  console.log("******** listaPorVendedorCliente180Dias *********");
  let sqlVendasPendentesDashVendedorGeralDiaAnterior = `select 
            SUM(ec.vlr_total) AS acumulado  
        FROM 
            entregas_contatos ec WHERE ec.status = 'Pendente' 
        AND 
            ec.codloja = $1
        AND
              ec.cod_cliente_pre  = $2
        AND 
            ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      cod_cliente,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

/// ************ gerentes x vendedores ******************

exports.listaDadosGeralGerenteVendedoresLista = async (req, res) => {
  console.log("******** listaDadosGeralVendedorClienteLista *********");

  let idLoja = req.params.idLoja;

  let sqlLista = `SELECT 
                        ec.cod_vendedor_pre,
                        ec.vendedor  as nome,
                        SUM(ec.vlr_total) AS acumulado
                    FROM 
                        entregas_contatos ec
                    WHERE 
                        ec.status = 'Pendente'
                        AND ec.codloja = $1
                        and ec.cod_cliente_pre <> '00003404'
                        AND ec.data_pre > CURRENT_DATE - INTERVAL '180 days'
                    GROUP BY 
                        ec.cod_vendedor_pre, ec.vendedor
                    ORDER BY 
                        acumulado DESC 
                    LIMIT $2`;

  try {
    let rs = await pg.execute(sqlLista, [idLoja, limiteRegistros]);
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
  console.log("******** listaDadosGeralVendedorClienteListaDetalhe *********");

  let results = [];
  let vendedor = req.params.vendedor;
  let idLoja = req.params.idLoja;

  console.log(vendedor, idLoja);

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

    console.log(response);
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
  console.log("******** listaPorVendedorGerenteUmDia *********");

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
              ec.data_pre  > CURRENT_DATE - INTERVAL '2 day'`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      vendedor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorVendedorGerenteSemanaAnterior(idloja, vendedor) {
  console.log("******** listaPorVendedorGerenteSemanaAnterior *********");
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
              ec.data_pre BETWEEN 
                DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' 
                AND DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 day'`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      vendedor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorVendedorGerenteMesAnterior(idloja, vendedor) {
  console.log("******** listaPorVendedorGerenteMesAnterior *********");
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
              ec.data_pre >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
          AND 
              ec.data_pre < DATE_TRUNC('month', CURRENT_DATE)`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      vendedor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}

async function listaPorVendedorGerente180Dias(idloja, vendedor) {
  console.log("******** listaPorVendedorGerente180Dias *********");
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
              ec.data_pre BETWEEN CURRENT_DATE - INTERVAL '180 days' AND CURRENT_DATE`;

  let rs;
  try {
    rs = await pg.execute(sqlVendasPendentesDashVendedorGeralDiaAnterior, [
      idloja,
      vendedor,
    ]);
    return rs.rows[0].acumulado;
  } catch (error) {
    console.log(error);
    return { error: error, mensagem: "Erro ao procurar" };
  }
}
