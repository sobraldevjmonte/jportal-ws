const pg = require("../conexao_jm");
const express = require("express");
const router = express.Router();

exports.buscarDadosEntregas = async (req, res) => {
  console.log("********** teste agenda scheduller **********");
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
  let sqlEntregasContatos =
    "SELECT " +
    '   MAX(ec.id) AS id, ' +
    '   MAX(ecd.id) AS idDetalhe, ' +
    "   ec.cod_loja_pre as codigoLoja, " +
    "   REPLACE(ec.np, ' ', '') AS np, " +
    "   TO_CHAR(ec.data_compromisso, 'DD/MM/YYYY') as dataCompromisso," +
    "   TO_CHAR(ec.data_pre, 'DD/MM/YYYY') as dataPreVenda," +
    "   ec.cod_cliente_pre as codigoCliente," +
    "   ec.cod_vendedor_pre as codVendedor," +
    "   ec.status ," +
    "   SUM(ec.vlr_total) AS valorTotal, " +
    "   MAX(ecd.obs) AS obs, " +
    "   ec.cliente, " +
    "   ec.vendedor, " +
    "   ec.fone, " +
    "   ec.celular, " +
    "   ec.tipoentrega " +
    "FROM " +
    "   entregas_contatos ec " +
    "LEFT JOIN entregas_contatos_detallhes ecd on " +
    "   REPLACE(ec.np, ' ', '') = ecd.np " +
    "WHERE " +
    "   ec.cod_vendedor_pre = $1 " +
    "AND " +
    "   ec.status = 'Finalizado' " +
    "AND " +
    "   ec.tipoentrega = 'LojaEntrega' " +
    "GROUP BY " +
    "     ec.cod_loja_pre, ec.np, ec.data_compromisso, ec.data_pre, " +
    "     ec.cod_cliente_pre, ec.cod_vendedor_pre, ec.status,ec.cliente, ec.vendedor,	ec.fone,	ec.celular,	ec.tipoentrega  " +
    "ORDER BY " +
    "   ec.np DESC";
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
