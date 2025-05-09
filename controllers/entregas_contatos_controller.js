const pg = require("../conexao_jm");
const pgProd = require("../conexao_jmonte_prod");
const express = require("express");
const router = express.Router();

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

exports.buscarDadosEntregasGeral = async (req, res) => {
  console.log("**********  scheduller importar entragas_contatos Geral **********");

  const sqlDump = "TRUNCATE TABLE entregas_contatos CASCADE";
  try {
    const existsRes = await pg.execute(sqlDump);
    console.log(
      "\x1b[32mRegistros apagados da tabela entregas_contatos.\x1b[0m"
    );
    /*x1b[31m → Vermelho
      \x1b[32m → Verde
      \x1b[33m → Amarelo
      \x1b[34m → Azul
      \x1b[35m → Magenta
      \x1b[36m → Ciano
      \x1b[0m → Resetar cor
      */
  } catch (error) {
    console.log("\x1b[31m❌ Erro ao executar a ação!\x1b[0m");
    console.log(error);
  }

  try {
    // 1. Consultar dados do banco X, convertendo datas para o formato adequado

    let sqlImportaEntregas;
    const resProd = await pgProd.execute(
      `
      SELECT 
        cod_loja_pre,
        --CAST(codloja AS INTEGER) AS codloja,
        codloja,
        np,
        data_pre,
        data_fat,
        data_compromisso,
        cod_cliente_pre,
        cod_vendedor_pre,
        cod_fornecedor_pre,
        cod_grupo_pre,
        cod_produto_pre,
        cod_familia,
        perc_ap,
        comissao,
        cod_bar_pre,
        situacao,
        tabela,
        plano_pre,
        status,
        quant,
        vlr_und,
        vlr_total,
        vlr_tabela,
        vlr_custo,
        vlr_importo,
        vlr_desp_adm,
        vlr_fator_financeiro,
        vlr_lucro,
        vlr_lucro_bruto,
        SUBSTRING(c_obs FROM 1 FOR 100) AS c_obs,
        cod_indica_pre,
        SUBSTRING(obs_pos FROM 1 FOR 100) AS obs_pos,
        data_proximo,
        foraestado,
        SUBSTRING(autorizacao FROM 1 FOR 100) AS autorizacao,
        prodpromo,
        pp,
        SUBSTRING(complemento FROM 1 FOR 100) AS complemento,
        tipoentrega,
        replace(cliente, '''',''),
        vendedor,
        fone,
        celular
      FROM vs_pwb_fprevendas x 
      WHERE data_compromisso >= CURRENT_DATE - INTERVAL '180 days' ` +
        `--AND data_compromisso < CURRENT_DATE - INTERVAL '10 day' ` +
        `AND codloja IS NOT NULL`
    );

    const rows = resProd.rows;
    console.log("tamanho: " + rows.length);

    // const targetValue = "1493.330";

    // // Verificar cada linha e campo
    // for (const row of rows) {
    //   for (const [key, value] of Object.entries(row)) {
    //     if (String(value) === targetValue) {
    //       console.log(
    //         `Valor '${targetValue}' encontrado no campo '${key}' na linha:`,
    //         row
    //       );
    //     }
    //   }
    // }

    if (rows.length > 0) {
      console.log("************* inserindo *******************");

      // Obtenha os nomes das colunas da tabela de destino
      const columnNames = `
        cod_loja_pre, codloja, np, data_pre, data_fat, data_compromisso, 
        cod_cliente_pre, cod_vendedor_pre, cod_fornecedor_pre, 
        cod_grupo_pre, cod_produto_pre, cod_familia, perc_ap, 
        comissao, cod_bar_pre, situacao, tabela, plano_pre, 
        status, quant, vlr_und, vlr_total, vlr_tabela, 
        vlr_custo, vlr_importo, vlr_desp_adm, vlr_fator_financeiro, 
        vlr_lucro, vlr_lucro_bruto, c_obs, cod_indica_pre, 
        obs_pos, data_proximo, foraestado, autorizacao, 
        prodpromo, pp, complemento, tipoentrega, 
        cliente, vendedor, fone, celular
      `;

      let xxx = 0;
      for (const row of rows) {
        // Verificar se a np já existe na tabela de destino
        const npExistsQuery = `
          SELECT COUNT(*) FROM entregas_contatos WHERE np = '${row.np}' and codloja = '${row.codloja}' and vlr_total = '${row.vlr_total}'`;
        const existsRes = await pg.execute(npExistsQuery);

        if (existsRes.rows[0].count > 0) {
          console.log(`NP ${row.np} já existe. Ignorando inserção.`);
          continue; // Pular a inserção se a np já existir
        }

        // // Função para sanitizar valores
        // const sanitizeValue = (value, index) => {
        //   if (
        //     value === null ||
        //     value === "" ||
        //     (typeof value === "string" && value.trim() === "")
        //   ) {
        //     return "NULL"; // Retorna NULL se o valor for vazio ou nulo
        //   }

        //   // Se for uma data, formata no estilo YYYY-MM-DD
        //   if (index === 2 || index === 3 || index === 4 || index === 34) {
        //     // data_pre, data_fat, data_compromisso, data_proximo
        //     return `'${dayjs(value).format("YYYY-MM-DD")}'`;
        //   }

        //   // Remove aspas de valores numéricos e trata strings
        //   if (typeof value === "number" || !isNaN(value)) {
        //     return value;
        //   } else {
        //     return `'${String(value).replace(/'/g, "''")}'`; // Sanitize strings
        //   }
        // };

        // Preparar a consulta de inserção
        const insertQuery = `
          INSERT INTO entregas_contatos (${columnNames}) VALUES (
            ${Object.values(row)
              .map((value, index) => {
                // Verifica se o valor é nulo e trata de acordo
                if (value === null) return "NULL";

                // Se o valor é uma data, converta usando dayjs
                if (index === 3 || index === 4 || index === 5 || index === 32) {
                  // data_pre, data_fat, data_compromisso, data_proximo
                  return `'${dayjs(value).format("YYYY-MM-DD")}'`; // Formato adequado para o PostgreSQL
                }

                // Escapar strings para evitar problemas de SQL injection
                return `'${String(value).replace(/'/g, "''")}'`;
              })
              .join(", ")}
          );
        `;

        console.log(insertQuery);
        // Executar a inserção
        console.log("sequencia: " + xxx);
        await pg.execute(insertQuery);
        xxx++;
      }
    }

    console.log("Transferência de dados concluída com sucesso!");
  } catch (error) {
    console.error("Erro ao transferir dados:", error);
  } finally {
    // 3. Fechar conexões
    await pg.end();
    await pgProd.end();
  }
};
exports.buscarDadosEntregasDoDia = async (req, res) => {
  console.log("**********  scheduller importar entragas_contatos **********");

  try {
    // 1. Consultar dados do banco X, convertendo datas para o formato adequado

    let sqlImportaEntregas;
    const resProd = await pgProd.execute(
      `
      SELECT 
        cod_loja_pre,
        --CAST(codloja AS INTEGER) AS codloja,
        codloja,
        np,
        data_pre,
        data_fat,
        data_compromisso,
        cod_cliente_pre,
        cod_vendedor_pre,
        cod_fornecedor_pre,
        cod_grupo_pre,
        cod_produto_pre,
        cod_familia,
        perc_ap,
        comissao,
        cod_bar_pre,
        situacao,
        tabela,
        plano_pre,
        status,
        quant,
        vlr_und,
        vlr_total,
        vlr_tabela,
        vlr_custo,
        vlr_importo,
        vlr_desp_adm,
        vlr_fator_financeiro,
        vlr_lucro,
        vlr_lucro_bruto,
        SUBSTRING(c_obs FROM 1 FOR 100) AS c_obs,
        cod_indica_pre,
        SUBSTRING(obs_pos FROM 1 FOR 100) AS obs_pos,
        data_proximo,
        foraestado,
        SUBSTRING(autorizacao FROM 1 FOR 100) AS autorizacao,
        prodpromo,
        pp,
        SUBSTRING(complemento FROM 1 FOR 100) AS complemento,
        tipoentrega,
        replace(cliente, '''',''),
        vendedor,
        fone,
        celular
      FROM vs_pwb_fprevendas x 
      WHERE data_compromisso = CURRENT_DATE`
    );

    const rows = resProd.rows;
    console.log("tamanho: " + rows.length);

    if (rows.length > 0) {
      console.log("************* inserindo *******************");

      // Obtenha os nomes das colunas da tabela de destino
      const columnNames = `
        cod_loja_pre, codloja, np, data_pre, data_fat, data_compromisso, 
        cod_cliente_pre, cod_vendedor_pre, cod_fornecedor_pre, 
        cod_grupo_pre, cod_produto_pre, cod_familia, perc_ap, 
        comissao, cod_bar_pre, situacao, tabela, plano_pre, 
        status, quant, vlr_und, vlr_total, vlr_tabela, 
        vlr_custo, vlr_importo, vlr_desp_adm, vlr_fator_financeiro, 
        vlr_lucro, vlr_lucro_bruto, c_obs, cod_indica_pre, 
        obs_pos, data_proximo, foraestado, autorizacao, 
        prodpromo, pp, complemento, tipoentrega, 
        cliente, vendedor, fone, celular
      `;

      let xxx = 0;
      for (const row of rows) {
        // Verificar se a np já existe na tabela de destino
        const npExistsQuery = `
          SELECT COUNT(*) FROM entregas_contatos WHERE np = '${row.np}' and codloja = '${row.codloja}' and vlr_total = '${row.vlr_total}'`;
        const existsRes = await pg.execute(npExistsQuery);

        if (existsRes.rows[0].count > 0) {
          console.log(`NP ${row.np} já existe. Ignorando inserção.`);
          continue; // Pular a inserção se a np já existir
        }

        // Preparar a consulta de inserção
        const insertQuery = `
          INSERT INTO entregas_contatos (${columnNames}) VALUES (
            ${Object.values(row)
              .map((value, index) => {
                // Verifica se o valor é nulo e trata de acordo
                if (value === null) return "NULL";

                // Se o valor é uma data, converta usando dayjs
                if (index === 3 || index === 4 || index === 5 || index === 32) {
                  // data_pre, data_fat, data_compromisso, data_proximo
                  return `'${dayjs(value).format("YYYY-MM-DD")}'`; // Formato adequado para o PostgreSQL
                }

                // Escapar strings para evitar problemas de SQL injection
                return `'${String(value).replace(/'/g, "''")}'`;
              })
              .join(", ")}
          );
        `;

        console.log(insertQuery);
        // Executar a inserção
        console.log("sequencia: " + xxx);
        await pg.execute(insertQuery);
        xxx++;
      }
    }

    console.log("Transferência de dados concluída com sucesso!");
  } catch (error) {
    console.error("Erro ao transferir dados:", error);
  } finally {
    // 3. Fechar conexões
    await pg.end();
    await pgProd.end();
  }
};

exports.salvarObsVendedor = async (req, res) => {
  console.log("*************** salvarObsVendedor **********");
  let obs = req.body.obs;
  let np = req.body.np;
  let codloja = req.body.codloja;

  let sql =
    "INSERT INTO entregas_contatos_detallhes (status, obs, np, cod_loja_pre) VALUES ($1, $2, $3, $4) RETURNING *";

  const resultInsert = await pg.execute(sql, ["E", obs, np, codloja]);
  const response = {
    mensagem: "Cadastrado com sucesso!",
    entrega_contato: {
      id: resultInsert.rows[0].id,
    },
  };
  res.status(201).send(response);
};

exports.alterarObsVendedor = async (req, res) => {
  console.log("*************** alterarObsVendedor **********");

  let obs = req.body.obs;
  let np = req.body.np;

  let sql = "UPDATE entregas_contatos_detallhes SET obs = $1 WHERE np = $2";

  await pg.execute(sql, [obs, np]);

  const response = {
    mensagem: "Alterado com sucesso!",
  };
  res.status(201).send(response);
};

exports.listarEntregasContatosVendedor = async (req, res) => {
  console.log("******** listarEntregasContatosVendedor *********");

  let idVendedor = req.params.idVendedor;
  let codigLoja = req.params.codigLoja;
  console.log("idVendedor: " + idVendedor)
  console.log("codigLoja: " + codigLoja)

  let sqlFiltro = "" 
  if(codigLoja !=  'ALL'){
    sqlFiltro = " AND ec.codloja = $2 " 
  }

  console.log(idVendedor);
  let sqlEntregasContatos =
    "SELECT " +
    "   MAX(ec.id) AS id, " +
    "   MAX(ecd.id) AS idDetalhe, " +
    "   ec.cod_loja_pre , " +
    "   ec.codloja , " +
    "   REPLACE(ec.np, ' ', '') AS np, " +
    "   TO_CHAR(ec.data_compromisso, 'DD/MM/YYYY') as dataCompromisso, " +
    "   TO_CHAR(ec.data_pre, 'DD/MM/YYYY') as dataPreVenda, " +
    "   ec.cod_cliente_pre as codigoCliente, " +
    "   ec.cod_vendedor_pre as codVendedor, " +
    "   ec.status, " +
    "   SUM(ec.vlr_total) AS valorTotal, " +
    "   MAX(ecd.obs) AS obs, " +
    "   ec.cliente, " +
    "   ec.vendedor, " +
    "   ec.fone, " +
    "   ec.celular, " +
    "   ec.tipoentrega " +
    "FROM " +
    "   entregas_contatos ec " +
    "LEFT JOIN entregas_contatos_detallhes ecd ON " +
    "   REPLACE(ec.np, ' ', '') = ecd.np " +
    "WHERE " +
    "   ec.cod_vendedor_pre = $1 " +  sqlFiltro +
    "AND " +
    "   ec.status = 'Finalizado' " +
    "AND " +
    "   ec.tipoentrega = 'LojaEntrega' " +
    "AND " +
    "   ec.data_compromisso < CURRENT_DATE - INTERVAL '1 day' " +
    "GROUP BY " +
    "   ec.cod_loja_pre, ec.codloja, ec.np, ec.data_compromisso, ec.data_pre, " +
    "   ec.cod_cliente_pre, ec.cod_vendedor_pre, ec.status, ec.cliente, " +
    "   ec.vendedor, ec.fone, ec.celular, ec.tipoentrega " +
    "ORDER BY " +
    "   ec.data_compromisso DESC";

  console.log(sqlEntregasContatos);
  let rs;
  try {
    if(codigLoja != 'ALL'){
      rs = await pg.execute(sqlEntregasContatos, [idVendedor, codigLoja]);
    }else{
      rs = await pg.execute(sqlEntregasContatos, [idVendedor]);
    }
    let countEntregas = rs.rows.length;

    const response = {
      registros: countEntregas,
      lista_contatos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaLojasDoAdmin = async (req, res) => {
  console.log("******** listaLojasDoAdmin *********");

  let sqlListaLojasDoAdmin = 
    `select l."idLoja", l."codigoLoja", l.icomp, l.fantasia from lojas l order by l."idLoja"`;
  console.log(sqlListaLojasDoAdmin);

  try {
    let rs = await pg.execute(sqlListaLojasDoAdmin);
    let countLojasDoAdmin = rs.rows.length;

    const response = {
      registros: countLojasDoAdmin,
      lista_lojas: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
}
exports.listaVendedoresDoGerente = async (req, res) => {
  console.log("******** listarEntregasContatosGerente *********");

  let codigoLoja = req.params.codigoLoja;
  console.log("idLoja: " + codigoLoja);

  let sqlListaVendedoresDoGerente =
    "select " +
    "   distinct(ec.cod_vendedor_pre) as codVendedor, " +
    "   ec.codloja , " +
    "   ec.vendedor " +
    "from " +
    "   entregas_contatos ec " +
    "where " +
    "	  ec.codloja = $1 " +
    "and " +
    "    ec.status = 'Finalizado' " +
    "and " +
    "    ec.tipoentrega = 'LojaEntrega' " +
    "and " +
    "    ec.data_compromisso <= CURRENT_DATE - interval '1 day' " +
    "order by ec.vendedor ";
  console.log(sqlListaVendedoresDoGerente);

  try {
    let rs = await pg.execute(sqlListaVendedoresDoGerente, [codigoLoja]);
    let countVendedoresDoGerente = rs.rows.length;

    const response = {
      registros: countVendedoresDoGerente,
      lista_contatos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listarEntregasContatosGerente = async (req, res) => {
  console.log("******** listarEntregasContatosGerente *********");

  let idVendedor = req.params.idVendedor;
  console.log(idVendedor);
  let sqlEntregasContatosGerente =
    "SELECT " +
    "   MAX(ec.id) AS id, " +
    "   MAX(ecd.id) AS idDetalhe, " +
    "   ec.cod_loja_pre as codigoLoja, " +
    "   ec.codloja , " +
    "   REPLACE(ec.np, ' ', '') AS np, " +
    "   TO_CHAR(ec.data_compromisso, 'DD/MM/YYYY') as dataCompromisso, " +
    "   TO_CHAR(ec.data_pre, 'DD/MM/YYYY') as dataPreVenda, " +
    "   ec.cod_cliente_pre as codigoCliente, " +
    "   ec.cod_vendedor_pre as codVendedor, " +
    "   ec.status, " +
    "   SUM(ec.vlr_total) AS valorTotal, " +
    "   MAX(ecd.obs) AS obs, " +
    "   ec.cliente, " +
    "   ec.vendedor, " +
    "   ec.fone, " +
    "   ec.celular, " +
    "   ec.tipoentrega " +
    "FROM " +
    "   entregas_contatos ec " +
    "LEFT JOIN entregas_contatos_detallhes ecd ON " +
    "   REPLACE(ec.np, ' ', '') = ecd.np " +
    "WHERE " +
    "   ec.codloja = $1 " +
    "AND " +
    "   ec.status = 'Finalizado' " +
    "AND " +
    "   ec.tipoentrega = 'LojaEntrega' " +
    "AND " +
    "   ec.data_compromisso < CURRENT_DATE - INTERVAL '1 day' " +
    "GROUP BY " +
    "   ec.cod_loja_pre, ec.codloja, ec.np, ec.data_compromisso, ec.data_pre, " +
    "   ec.cod_cliente_pre, ec.cod_vendedor_pre, ec.status, ec.cliente, " +
    "   ec.vendedor, ec.fone, ec.celular, ec.tipoentrega " +
    "ORDER BY " +
    "   ec.data_compromisso DESC";

  //'LIMIT 5';
  console.log(sqlEntregasContatosGerente);

  try {
    let rs = await pg.execute(sqlEntregasContatosGerente, [idVendedor]);
    let countEntregasGerente = rs.rows.length;

    const response = {
      registros: countEntregasGerente,
      lista_contatos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
