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

exports.rejeitarNp = async (req, res) => {
  let id_vendas = req.params.id_vendas;
  console.log(id_vendas);
  let sqlUpdateNp = "UPDATE vendas SET status = 'R' WHERE id_vendas = $1";

  try {
    console.log("**************** linha 63 ************************");
    let rs = await pg.execute(sqlUpdateNp, [id_vendas]);
    console.log("+++++++++++++++++ xibiu **************++");

    if (rs.rowCount === 1) {
      res.status(200).send("*** Registro aprovado com sucesso ***");
    } else {
      res.status(400).send("*** Nenhum registro foi atualizado ***");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("**** Erro ao salvar ****");
  }
};
exports.aprovarNp = async (req, res) => {
  let id_vendas = req.params.id_vendas;
  let id_usuario = req.params.id_usuario;
  let pontos_venda = +req.params.pontos_venda;
  console.log(id_vendas);
  let sqlUpdateNp = "UPDATE vendas SET status = 'A' WHERE id_vendas = $1";

  try {
    console.log("**************** linha 63 ************************");
    let rs = await pg.execute(sqlUpdateNp, [id_vendas]);
    console.log("+++++++++++++++++ xibiu **************++");

    if (rs.rowCount === 1) {
      try {
        let buscaPontosDoUsuario =
          "select u.pontos_saldo from usuarios u where u.id_usuario = $1 ";
        let rsPontos = await pg.execute(buscaPontosDoUsuario, [id_usuario]);

        let pontos_saldo = +rsPontos.rows[0].pontos_saldo;
        if (pontos_saldo == null || pontos_saldo < 0) {
          pontos_saldo = 0;
        }
        pontos_saldo = pontos_saldo + pontos_venda;
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>> pontos_saldo: ${pontos_saldo}`);

        let sqlUpdatePontosDoUsuario =
          "UPDATE usuarios SET pontos_saldo = $1 WHERE id_usuario = $2";
        await pg.execute(sqlUpdatePontosDoUsuario, [pontos_saldo, id_usuario]);

        res.status(200).send("*** Registro aprovado com sucesso ***");
      } catch (error) {
        res
          .status(200)
          .send(
            "*** Não foi possivel atualizar o saldo de pontos do usuário ***"
          );
      }
    } else {
      res.status(400).send("*** Nenhum registro foi atualizado ***");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("**** Erro ao salvar ****");
  }
};
exports.salvarNp = async (req, res) => {
  let data_np = req.body.data_np;
  let valor_np = req.body.valor_np;
  let total_pontos = req.body.vlr_pp;
  let numero_np = req.body.numero_np;
  let id_np = req.params.id_np;
  let id_loja = req.body.id_loja;

  let date = moment(data_np, "DD/MM/YYYY");
  let formattedDate = date.format("YYYY-MM-DD");

  console.log(total_pontos);
  console.log(formattedDate);
  console.log(valor_np);
  console.log(numero_np);
  console.log(id_loja);
  console.log(id_np);

  let sqlUpdateNp =
    "UPDATE vendas SET total_pontos = $1, data_np = $2, valor = $3, numero_np = $4, id_loja = $5 WHERE id_vendas = $6";

  try {
    console.log("**************** linha 80 ************************");
    let rs = await pg.execute(sqlUpdateNp, [
      total_pontos,
      formattedDate,
      valor_np,
      numero_np,
      id_loja,
      id_np,
    ]);
    console.log("+++++++++++++++++ xibiu **************++");
    console.log(rs);

    if (rs.rowCount === 1) {
      res.status(200).send("*** Registro atualizado com sucesso ***");
    } else {
      res.status(400).send("*** Nenhum registro foi atualizado ***");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("**** Erro ao salvar ****");
  }
};

exports.buscaNp = async (req, res) => {
  let numero_np = req.params.numero_np;
  let sqlBuscaNp =
    "select sum(vpf.vlr_total) as vlr_total, sum(vpf.pp) as vlr_pp, " +
    "MAX(TO_CHAR(vpf.data_np,'DD/MM/YYYY')) AS data_np, " +
    "CAST(vpf.codloja AS INTEGER) AS codloja " +
    "from tabela_pontuacao vpf " +
    "where np = $1 GROUP BY CAST(vpf.codloja AS INTEGER); ";
  console.log("************** buscaNp ********************");
  console.log(sqlBuscaNp);

  try {
    let rs = await pg.execute(sqlBuscaNp, [numero_np]);
    if (rs.rowCount > 0) {
      let sqlLoja =
        "SELECT l.descricao_loja FROM lojas l WHERE l.id_loja_venda = $1";
      let rsx = await pg.execute(sqlLoja, [rs.rows[0].codloja]);
      let descricao_loja = rsx.rows[0].descricao_loja;

      const response = {
        vlr_total: rs.rows[0].vlr_total,
        vlr_pp: rs.rows[0].vlr_pp,
        data_np: rs.rows[0].data_np,
        id_loja: rs.rows[0].codloja,
        descricao_loja: descricao_loja,
      };
      res.status(200).send(response);
    } else {
      res.status(204).send("Nao encontrado");
    }
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
    "   v.id_usuario, " +
    "   v.numero_venda, " +
    "   v.numero_np, " +
    "   TO_CHAR(v.data_venda,'DD/MM/YYYY') as data_venda, " +
    "   TO_CHAR(v.data_lancamento,'DD/MM/YYYY') as data_lancamento, " +
    "   l.descricao_loja, " +
    "   l.id_loja_venda as id_loja, " +
    "   TO_CHAR(v.data_np,'DD/MM/YYYY') as data_np, " +
    "   TO_CHAR(v.data_pagamento, 'DD/MM/YYYY') as data_pagamento," +
    "   v.valor as valor_np, " +
    "   u.nome as profissional, " +
    "   v.status, " +
    "   v.total_pontos, " +
    "   v.imagem, " +
    "   v.rejeicoes, " +
    "   v.motivo_rejeicao, " +
    "   v.premiado, " +
    "   v.aberto " +
    "FROM " +
    "   vendas v " +
    "   left join usuarios u on " +
    "     v.id_usuario = u.id_usuario " +
    "   left join lojas l on " +
    "     v.id_loja = l.id_loja_venda ORDER BY v.id_vendas DESC";
  console.log("************** listarPedidos ********************");
  console.log(sqlPedidos);

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

exports.nada = async (req, res) => {
  console.log("nada", req);
  res.status(200).send("resposta de anexar arquivo fazer nada");
};
exports.premiosListar = async (req, res) => {
  const pathImagem = "/brindes";
  let sqlListarPremios = "SELECT * FROM brindes ORDER BY id_brinde";

  try {
    let rs = await pg.execute(sqlListarPremios);
    let countPremios = rs.rows.length;

    // Adicionar o caminho completo da imagem a cada registro
    let listaPremiosComImagem = rs.rows.map((premio) => ({
      ...premio,
      imagem: `${pathImagem}/${premio.imagem}`, // Ajuste este campo conforme o nome real da coluna
    }));

    const response = {
      registros: countPremios,
      //totais_np: rst.rows,
      lista_premios: listaPremiosComImagem,
      // lista_pedidos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
//-------------- SALVAR IMAGEM PRODs --------------
exports.atualizarImagem = async (req, res) => {
  let dados = req.body;

  let id_brinde = dados.id_brinde;
  let descricao = dados.descricao;
  let pontos = dados.pontos;
  let valor = dados.valor;
  let quantidade = dados.quantidade;
  let link_anexo = dados.imagem;
  let ativo = dados.ativo;

  let updateBrinde =
    "UPDATE brindes " +
    "SET descricao = $1, pontos = $2, valor = $3, quantidade = $4, imagem = $5, ativo = $6  " +
    "WHERE id_brinde = $7)";
  try {
    await pg.execute(updateBrinde, [
      descricao,
      pontos,
      valor,
      quantidade,
      link_anexo,
      ativo,
      id_brinde,
    ]);

    const response = {
      mensagem: "Imagem do brinde atualizado!",
    };
    console.log("--------- ATUALIZAR IMAGEM BRINDE -------");
    res.status(201).send(response);
  } catch (error) {
    return res
      .status(500)
      .send({ error: error, mensagem: "Não foi possivel atualizar!" });
  }
};

exports.inativarBrinde = async (req, res) => {
  let id_brinde = req.params.id_brinde;
  let sqlVerificaStatus = "SELECT ativo FROM brindes WHERE id_brinde = $1";
  let st = "S";

  let rsVerifica = await pg.execute(sqlVerificaStatus, [id_brinde]);
  let status = rsVerifica.rows[0].ativo;
  console.log("status ------------------> " + status);
  if (status === "S") st = "N";

  let sqlAtualizaEstado = "UPDATE brindes SET ativo = $2 WHERE id_brinde = $1";
  await pg.execute(sqlAtualizaEstado, [id_brinde, st]);

  const response = {
    mensagem: "Brinde atuallizado!",
  };
  res.status(200).send(response);
};

exports.excluirBrinde = async (req, res) => {
  let id_brinde = req.params.id_brinde;
  let sqlVerificaMovimento =
    "SELECT * FROM brindes_premiacoes WHERE id_premio = $1";
  let rsVerifica = await pg.execute(sqlVerificaMovimento, [id_brinde]);
  let regVerifica = rsVerifica.rows.length;
  if (regVerifica > 0) {

    const response = {
      mensagem: `Não é possível excluir! Existem ${regVerifica} registros relacionados a esse brinde.`,
      quantidade: regVerifica,
    };
    res.status(409).send(response);
  } else {
    try {
      let sqlExcluirBrinde = "DELETE FROM brindes WHERE id_brinde = $1";
      await pg.execute(sqlExcluirBrinde, [id_brinde]);
      const response = {
        mensagem: "Brinde excluido com sucesso!",
        quantidade: regVerifica,
      };
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send("Erro na requisição");
    }
  }
};
exports.salvarBrinde = async (req, res) => {
  const ativo = "S";
  const { descricao, pontos, valor, quantidade, imagem } = req.body;
  const resultInsert = await pg.execute(
    "INSERT INTO brindes (descricao, pontos, valor, quantidade, imagem, ativo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [descricao.toUpperCase(), pontos, valor, quantidade, imagem, ativo]
  );

  const response = {
    mensagem: "Brinde cadastrado com sucesso!",
    brinde: {
      id_brinde: resultInsert.rows[0].id_brinde,
      descricao: descricao,
    },
  };
  res.status(201).send(response);
};
