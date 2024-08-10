const pg = require("../conexao_prof_jmonte");
const pgJmonte = require("../conexao_jm");
const moment = require("moment");

const {
  dataHoje,
  formatToBRL,
  parseDate,
  getDaysDifference,
} = require("../uteis/uteis");

exports.listarPedidos = async (req, res) => {
  let sqlListaPedidosBrindes =
    "select " +
    "   b.descricao as descricao_brinde, " +
    "   b.pontos as pontos_brinde, " +
    "   b.quantidade as estoque, " +
    "   u.nome as nome_parceiro, " +
    "   u2.nome_usuario as nome_autorizador, " +
    "   u3.nome_usuario as nome_entregador, " +
    "   bp.id_premiacao , " +
    "   bp.id_parceiro , " +
    "   bp.id_premio , " +
    "   bp.id_autorizador , " +
    "   TO_CHAR(bp.data_solicitacao, 'DD/MM/YYYY') AS data_solicitacao, " +
    "   TO_CHAR(bp.data_autorizacao, 'DD/MM/YYYY') as data_autorizacao , " +
    "   bp.autorizado , " +
    "   bp.status , " +
    "   bp.entregue , " +
    "   TO_CHAR(bp.data_entrega, 'DD/MM/YYYY')as data_entrega  " +
    "from " +
    "   brindes_premiacoes bp " +
    "join brindes b on " +
    "   bp.id_premio = b.id_brinde " +
    "left join usuarios u on " +
    "   bp.id_parceiro = u.id_usuario " +
    "left join usuarios_adm u2 on " +
    "   bp.id_autorizador = u2.id " +
    "left join usuarios_adm u3 on " +
    "   bp.id_entregador = u3.id " +
    "order by " +
    "   bp.id_premiacao";
  console.log(sqlListaPedidosBrindes);
  //let sqlListaPedidosBrindes = "SELECT * FROM brindes_premiacoes ORDER BY id_premiacao";
  try {
    const result = await pg.execute(sqlListaPedidosBrindes);
    const response = {
      quantidade: result.rows.length,
      pedidos: result.rows,
    };
    console.log("---------- LISTA TODOS OS PEDIDOS BRINDES ----------------");
    res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.aprovarPedido = async (req, res) => {
  console.log("************* APROVAR PEDIDO **************");
  let id_pedido = req.params.id_pedido;
  let id_autorizador = req.params.id_autorizador;
  let dataAutorizacao = dataHoje();

  try {
    let sqlUsuario =
      'select u.id from usuarios_adm u where u."id_usuario" = $1';
    let rsa = await pg.execute(sqlUsuario, [id_autorizador]);
    console.log(
      "------------- res consulta usuario local (rsa)----------------"
    );
    console.log(rsa);
    if (rsa.rows.length) {
      id_autorizador = rsa.rows[0].id;
    } else {
      let buscaUsuarioJmonte =
        'select u."nomeUsuario" from usuarios u where u."idUsuario" = $1';
      let rsaxx = await pgJmonte.execute(buscaUsuarioJmonte, [id_autorizador]);
      console.log(
        "------------- res consulta usuario jmonte (rsaxx)--------------------"
      );
      console.log(rsaxx);
      let nome_usuario = rsaxx.rows[0].nomeUsuario;
      console.log("****************** nomeusuario: " + nome_usuario);

      let sqlSalvaUsuario =
        "INSERT INTO usuarios_adm (id_usuario, nome_usuario) VALUES ($1, $2) returning id";
      let rsax = await pg.execute(sqlSalvaUsuario, [
        id_autorizador,
        nome_usuario,
      ]);

      id_autorizador = rsax.id;
      console.log(
        "**************** novo usuario salvo no banco (rsax) **********************"
      );
      console.log(rsax);
    }
  } catch (error) {
    console.log(error);
  }

  let statusFinalPedido = "APROVADO";
  let sqlUpStatusPedido =
    "UPDATE brindes_premiacoes SET status = $1, id_autorizador = $2, data_autorizacao = $3, autorizado = true WHERE id_premiacao = $4";

  console.log(sqlUpStatusPedido);
  await pg.execute(sqlUpStatusPedido, [
    statusFinalPedido,
    id_autorizador,
    dataAutorizacao,
    id_pedido,
  ]);
  res.status(201).send("********* aprovar pedido ****************" + id_pedido);
};

exports.rejeitaPedido = async (req, res) => {
  let id_pedido = req.params.id_pedido;
  let id_parceiro = req.params.id_parceiro;
  let sqlPedido =
    "SELECT pontos, status FROM brindes_premiacoes WHERE id_premiacao = $1";

  console.log("************* REJEITAR PEDIDO **************");

  let result = await pg.execute(sqlPedido, [id_pedido]);

  if (result.rowCount > 0) {
    let pontosDoPedido = +result.rows[0].pontos;
    let statusDoPedido = result.rows[0].status;

    if (statusDoPedido === "PENDENTE" || statusDoPedido === "APROVADO") {
      let dadosUsuario =
        "SELECT pontos_saldo FROM usuarios WHERE id_usuario = $1";
      let rsDadosUsuarios = await pg.execute(dadosUsuario, [id_parceiro]);
      let pontosAtuaisUsuario = +rsDadosUsuarios.rows[0].pontos_saldo;

      let sqlRetornaPontos =
        "UPDATE usuarios SET pontos_saldo = $1 WHERE id_usuario = $2";
      let totalPontosFinal = pontosAtuaisUsuario + pontosDoPedido;

      await pg.execute(sqlRetornaPontos, [totalPontosFinal, id_parceiro]);

      let statusFinalPedido = "REJEITADO";
      let sqlUpStatusPedido =
        "UPDATE brindes_premiacoes SET status = $1, autorizado = false WHERE id_premiacao = $2";
      await pg.execute(sqlUpStatusPedido, [statusFinalPedido, id_pedido]);
    }

    const response = {
      mensagem: "EXECUTADO COM SUCESSO!",
    };

    return res.status(200).send(response);
  } else {
    return res.status(404).send("Pedido não encontrado");
  }
};

exports.liberarPedido = async (req, res) => {
  let id_pedido = req.params.id_pedido;
  let id_premio = req.params.id_premio;

  //****************** retornando saldo do premio/estoque *********************/
  let sqlDadosBrinde = "SELECT quantidade FROM brindes WHERE id_brinde = $1";
  let rsDadosBrinde = await pg.execute(sqlDadosBrinde, [id_premio]);
  let estoque = rsDadosBrinde.rows[0].quantidade;

  let saldoFinal = estoque - 1;
    let sqlAtualizaEstado =
      "UPDATE brindes SET quantidade = $1 WHERE id_brinde = $2";
    await pg.execute(sqlAtualizaEstado, [saldoFinal, id_premio]);


  let statusFinalPedido = "PENDENTE";
  let sqlUpStatusPedido =
    "UPDATE brindes_premiacoes SET status = $1, id_autorizador = null, data_autorizacao = null, data_entrega=null, id_entregador = null, entregue = false, autorizado = false WHERE id_premiacao = $2";
  await pg.execute(sqlUpStatusPedido, [statusFinalPedido, id_pedido]);

  const response = {
    mensagem: "EXECUTADO COM SUCESSO!",
  };

  return res.status(200).send(response);
};

exports.entregarPedido = async (req, res) => {
  let id_pedido = req.params.id_pedido;
  let id_premio = req.params.id_premio;
  let id_entregador = req.params.id_entregador;
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++");

  let sqlDadosBrinde = "SELECT quantidade FROM brindes WHERE id_brinde = $1";
  let rsDadosBrinde = await pg.execute(sqlDadosBrinde, [id_premio]);
  let estoque = rsDadosBrinde.rows[0].quantidade;

  console.log(estoque);
  if (estoque > 0) {
    let saldoFinal = estoque - 1;
    let sqlAtualizaEstado =
      "UPDATE brindes SET quantidade = $1 WHERE id_brinde = $2";
    await pg.execute(sqlAtualizaEstado, [saldoFinal, id_premio]);

    let statusDoPedido = "ENTREGUE";
    let dataEntrega = dataHoje();
    let pedidoEntregue = true;

    let sqlUsuario =
      'select u.id from usuarios_adm u where u."id_usuario" = $1';
    let rsa = await pg.execute(sqlUsuario, [id_entregador]);
    id_entregador = rsa.rows[0].id;

    let sqlAtualizaPedido =
      "UPDATE brindes_premiacoes SET status = $1, data_entrega = $2, entregue = $3, id_entregador = $4 WHERE id_premiacao = $5";
    await pg.execute(sqlAtualizaPedido, [
      statusDoPedido,
      dataEntrega,
      pedidoEntregue,
      id_entregador,
      id_pedido,
    ]);
    const response = {
      status: 200,
      msg: "Efetuado com sucesso.",
    };
    res.status(200).send(response);
  } else {
    const response = {
      status: 404,
      msg: "Saldo insuficiente em estoque.",
    };
    res.status(404).send(response);
  }
};
