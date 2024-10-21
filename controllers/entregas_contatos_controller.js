const pg = require("../conexao_jm");
const pgProd = require("../conexao_jmonte_prod");
const express = require("express");
const router = express.Router();

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

exports.buscarDadosEntregas = async (req, res) => {
  console.log("********** teste agenda scheduller **********");

  try {
    // 1. Consultar dados do banco X, convertendo datas para o formato adequado
    const resProd = await pgProd.execute(`
      SELECT 
        cod_loja_pre,
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
        c_obs,
        cod_indica_pre,
        obs_pos,
        data_proximo,
        foraestado,
        autorizacao,
        prodpromo,
        pp,
        complemento,
        tipoentrega,
        replace(cliente, '''',''),
        vendedor,
        fone,
        celular
      FROM vs_pwb_fprevendas x 
      WHERE x.data_compromisso >= CURRENT_DATE - 30 and cod_loja_pre is not null`);
    
    const rows = resProd.rows;
    console.log('tamanho: ' + rows.length);

    // 2. Inserir dados no banco Y
    if (rows.length > 0) {
      console.log("************* inserindo *******************");
      
      // Obtenha os nomes das colunas da tabela de destino
      const columnNames = `
        cod_loja_pre, np, data_pre, data_fat, data_compromisso, 
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
          SELECT COUNT(*) FROM entregas_contatos WHERE np = '${row.np}' and cod_loja_pre = '${row.cod_loja_pre}'`;
        const existsRes = await pg.execute(npExistsQuery);
        
        if (existsRes.rows[0].count > 0) {
          console.log(`NP ${row.np} já existe. Ignorando inserção.`);
          continue; // Pular a inserção se a np já existir
        }

        // Preparar a consulta de inserção
        const insertQuery = `
          INSERT INTO entregas_contatos (${columnNames}) VALUES (
            ${Object.values(row).map((value, index) => {
              // Verifica se o valor é nulo e trata de acordo
              if (value === null) return "NULL";
              
              // Se o valor é uma data, converta usando dayjs
              if (index === 2 || index === 3 || index === 4 || index === 28) { // data_pre, data_fat, data_compromisso, data_proximo
                return `'${dayjs(value).format("YYYY-MM-DD")}'`; // Formato adequado para o PostgreSQL
              }
              
              return `'${value}'`;
            }).join(", ")}
          );
        `;
        

        console.log(insertQuery);
        // Executar a inserção
        console.log('sequencia: ' + xxx)
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
  console.log(resultInsert);

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
  console.log(idVendedor)
  let sqlEntregasContatos =
    "SELECT " +
    "   MAX(ec.id) AS id, " +
    "   MAX(ecd.id) AS idDetalhe, " +
    "   ec.cod_loja_pre as codigoLoja, " +
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
    "   ec.cod_vendedor_pre = $1 " +
    "AND " +
    "   ec.status = 'Finalizado' " +
    "AND " +
    "   ec.tipoentrega = 'LojaEntrega' " +
    "AND " +
    "   ec.data_compromisso < CURRENT_DATE - INTERVAL '1 day' " +
    "GROUP BY " +
    "   ec.cod_loja_pre, ec.np, ec.data_compromisso, ec.data_pre, " +
    "   ec.cod_cliente_pre, ec.cod_vendedor_pre, ec.status, ec.cliente, " +
    "   ec.vendedor, ec.fone, ec.celular, ec.tipoentrega " +
    "ORDER BY " +
    "   ec.data_compromisso DESC";

  //'LIMIT 5';
  console.log(sqlEntregasContatos);
 
  try {
    let rs = await pg.execute(sqlEntregasContatos, [idVendedor]);
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
