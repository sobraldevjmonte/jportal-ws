const pg = require("../conexao_prof_jmonte");
const moment = require("moment");

exports.inativarUsuario = async (req, res) => {
  let id = req.params.id;
  let status = "N";
  let sqlUpdate = "UPDATE usuarios set ativo = $1 WHERE id_usuario = $2";
  try {
    await pg.execute(sqlUpdate, [status, id]);
    const response = {
      status: 200,
      //totais_np: rst.rows,
      //lista_usuarios: rs.rows,
    };
    res.status(200).send("response");
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao ativar" });
  }
};
exports.ativarUsuario = async (req, res) => {
  let id = req.params.id;
  let status = "S";
  let sqlUpdate = "UPDATE usuarios set ativo = $1 WHERE id_usuario = $2";
  try {
    await pg.execute(sqlUpdate, [status, id]);
    const response = {
      status: 200,
      //totais_np: rst.rows,
      //lista_usuarios: rs.rows,
    };
    res.status(200).send("response");
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.listarUsuarios = async (req, res) => {
  let sqlPedidos = "SELECT * FROM usuarios ORDER BY id_usuario";
  console.log("************** listarPedidos ********************");

  try {
    let rs = await pg.execute(sqlPedidos);
    let countPedidos = rs.rows.length;

    const response = {
      registros: countPedidos,
      //totais_np: rst.rows,
      lista_usuarios: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.listarPedidos = async (req, res) => {
  const pathImagem = "/anexos";
  let sqlPedidos =
    "SELECT " +
    "   v.id_vendas, " +
    "   v.numero_venda, " +
    "   v.numero_np, " +
    "   TO_CHAR(v.data_venda,'DD/MM/YYYY') as data_venda, " +
    "   TO_CHAR(v.data_lancamento,'DD/MM/YYYY') as data_lancamento, " +
    "   l.descricao_loja, " +
    "   TO_CHAR(v.data_np,'DD/MM/YYYY') as data_np, " +
    "   TO_CHAR(v.data_pagamento, 'DD/MM/YYYY') as data_pagamento," +
    "   v.valor as valor_np, " +
    "   u.nome as profissional, " +
    "   v.status, " +
    "   v.total_pontos, " +
    "   v.imagem, " +
    "   v.rejeicoes, " +
    "   v.motivo_rejeicao, " +
    "   v.premiado " +
    "FROM " +
    "   vendas v " +
    "   left join usuarios u on " +
    "     v.id_usuario = u.id_usuario " +
    "   left join lojas l on " +
    "     v.id_loja = l.id_loja_venda";
  console.log("************** listarPedidos ********************");
  console.log(sqlPedidos)

  try {
    let rs = await pg.execute(sqlPedidos);
    let countPedidos = rs.rows.length;

    // Adicionar o caminho completo da imagem a cada registro
    const listaPedidosComImagem = rs.rows.map((pedido) => ({
      ...pedido,
      imagem: `${pathImagem}/${pedido.imagem}`, // Ajuste este campo conforme o nome real da coluna
    }));

    const response = {
      registros: countPedidos,
      //totais_np: rst.rows,
      lista_pedidos: listaPedidosComImagem,
      // lista_pedidos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
