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
  let sqlPedidos = "SELECT * FROM vendas";
  console.log("************** listarPedidos ********************");

  try {
    let rs = await pg.execute(sqlPedidos);
    let countPedidos = rs.rows.length;

    const response = {
      registros: countPedidos,
      //totais_np: rst.rows,
      lista_pedidos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
