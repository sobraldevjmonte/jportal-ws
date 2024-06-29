const pg = require("../conexao_jm");
const moment = require("moment");

exports.listarClientes = async (req, res) => {
  console.log("------------- listarClientes(etapas) -------------------");

  let idLoja = +req.params.idLoja;
  let sqlFiltroLoja = "";

  if (idLoja > 0) sqlFiltroLoja = `AND u."idLoja" = ${idLoja}`;

  console.log(idLoja);
  const ativo = "S";
  const valorNivel = "3";
  const sqlLListaClientes =
    "select " +
    '   u."nomeUsuario", ' +
    '   u."idUsuario" , ' +
    '   u."codigoVendedor", ' +
    '   nu."valorNivel", ' +
    '   l."idLoja"  ' +
    "from " +
    "   usuarios  u " +
    "left join lojas l on " +
    '   u."idLoja" = l."idLoja"  ' +
    'left join "nivelUsuario" nu on ' +
    '   u."idNivelUsuario" = nu."idNivelUsuario"  ' +
    "where " +
    '   u."ativo" = $1 ' +
    "and " +
    '   u."idLoja" = l."idLoja" ' +
    "AND " +
    '   u."idNivelUsuario" = nu."idNivelUsuario" ' +
    "AND " +
    '   nu."valorNivel"  = $2 ' +
    sqlFiltroLoja +
    "ORDER BY " +
    '   u."nomeUsuario"';

  console.log(sqlLListaClientes);
  try {
    let rs = await pg.execute(sqlLListaClientes, [ativo, valorNivel]);
    let countIndicadores = rs.rows.length;

    const response = {
      idLojaPassado: idLoja,
      quantidade: countIndicadores,
      vendedores: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaEtapas = async (req, res, listaLojas) => {
  let sqlListaEtapas =
    'SELECT DISTINCT "idetapa", "nome_etapa" FROM "vendasPendentesGeral" ORDER BY "idetapa"';
  console.log(sqlListaEtapas);
  try {
    let rs = await pg.execute(sqlListaEtapas);
    let countEtapas = rs.rows.length;

    const response = {
      quantidade: countEtapas,
      listaDeEtapas: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaLojas = async (req, res) => {
  const sqlLListaLojas =
    "SELECT " +
    'l."idLoja", l.fantasia as descricao, l."codigoLoja",l.icomp ' +
    "FROM " +
    "lojas l " +
    'ORDER BY l."idLoja"';

  console.log(sqlLListaLojas);
  try {
    let rs = await pg.execute(sqlLListaLojas);
    const response = {
      lojas: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaVendedores = async (req, res) => {
  let ativo = "S";

  console.log("************** ROTA COUNT INDICADORES ****************");

  /********************************************************/
  let sqlListaVendedores =
    "SELECT " +
    '     u."idUsuario" , u."idLoja" , u."idNivelUsuario" , u."codigoVendedor" , u."nomeUsuario"  ' +
    "FROM usuarios u " +
    " WHERE " +
    '     u."idNivelUsuario" = 3 ' +
    "AND " +
    "     u.ativo = $1 " +
    "ORDER BY " +
    '     u."nomeUsuario"';

  console.log(sqlListaVendedores);
  /********************************************************/
  try {
    let rsCount = await pg.execute(sqlListaVendedores, [ativo]);
    let countVendedores = rsCount.rows.length;

    const response = {
      quantidade: countVendedores,
      vendedores: rsCount.rows,
    };
    console.log("-------- LISTA VENDEDORES -------");
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaVendedoresPorLoja = async (req, res) => {
  //********************* para gerente *****************************/

  console.log("-------------- listaVendasVendedoresGerentes --------------");
  let idLoja = req.params.idLoja;
  let ordem = req.params.ordem;
  console.log("idLoja---------> " + idLoja);
  console.log(
    "------------------------------------------------------- ordem -------------------------------------------------------------------------------" +
      ordem
  );
  let ativo = "S";

  // Verifica se a direção da ordenação é válida
  if (!["ASC", "DESC"].includes(ordem.toUpperCase())) {
    throw new Error("Direção de ordenação inválida");
  }
  console.log("------------------ ordem  " + ordem);

  let sqlListaVendedores =
    "SELECT " +
    '     u."idUsuario" as idvendedor, u."idLoja" , u."codigoVendedor" , u."nomeUsuario" as nomeVendedor ' +
    "FROM usuarios u " +
    " WHERE " +
    '     u."idNivelUsuario" = 3 ' +
    "AND " +
    '     u."idLoja" = $2 ' +
    "AND " +
    "     u.ativo = $1 " +
    `ORDER BY  u."nomeUsuario" ${ordem}`;

  console.log(sqlListaVendedores);
  /********************************************************/
  try {
    let rsCount = await pg.execute(sqlListaVendedores, [ativo, idLoja]);
    let countVendedores = rsCount.rows.length;

    const response = {
      quantidade: countVendedores,
      vendedores: rsCount.rows,
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.listaVendasVendedores = async (req, res) => {
  console.log("------------------ listaVendasVendedores ---------------------");
  let idVendedor = req.params.idVendedor;
  let ordem = req.params.ordem;
  let ativo = "S";
  console.log("------------------ ordem -------------" + ordem);
  //console.log("idVendedor---------> " + idVendedor);

  // Verifica se a direção da ordenação é válida
  if (!["ASC", "DESC"].includes(ordem.toUpperCase())) {
    throw new Error("Direção de ordenação inválida");
  }
  console.log("------------------ ordem  " + ordem);

  let sqlListaPendenciasEtapasVendedores =
    "select " +
    "   v.idvendedor || '' || v.idcliente as seq, " +
    '   v."totalGeraPendenteCadaCliente" as totalCliente, ' +
    "   v.idcliente as idCliente, " +
    "   v.nome_cliente as nomeCliente, " +
    "   v.idvendedor as idVendedor, " +
    '   u."nomeUsuario" as nomeVendedor , ' +
    '   l."codigoLoja"  as codigoLoja, ' +
    "   v.etapapend1 as etapa1 , " +
    "   v.etapapend2 as etapa2 , " +
    "   v.etapapend3 as etapa3 , " +
    "   v.etapapend4 as etapa4 , " +
    "   v.etapapend5 as etapa5 , " +
    "   v.etapapend6 as etapa6 , " +
    "   v.etapapend7 as etapa7 , " +
    "   v.etapapend8 as etapa8 , " +
    "   v.etapapend9 as etapa9, " +
    "   v.etapapend10 as etapa10 " +
    "from " +
    '   "vendasPendentesFinal" v ' +
    "   join usuarios u on " +
    '     v.idvendedor = u."codigoVendedor"  ' +
    "   join lojas l on " +
    '     u."idLoja"  = l."idLoja" ' +
    "     and u.ativo = $2" +
    "WHERE " +
    "     v.idvendedor = $1 " +
    `ORDER BY v."totalGeraPendenteCadaCliente" ${ordem}`;

  console.log(sqlListaPendenciasEtapasVendedores);
  /********************************************************/
  try {
    let rsCountPendenciasVendas = await pg.execute(
      sqlListaPendenciasEtapasVendedores,
      [idVendedor, ativo]
    );
    let countPendenciasEtapas = rsCountPendenciasVendas.rows.length;

    for (let i = 0; i < countPendenciasEtapas; i++) {
      let idx = rsCountPendenciasVendas.rows[i].idcliente;

      let sqlContatosComClientes =
        'SELECT * FROM "vendasPendentesFinalContatoFeitoClientes" c WHERE c.idcliente = $1';
      let rsCountContatosComClientes = await pg.execute(
        sqlContatosComClientes,
        [idx]
      );
      let quantContatos = rsCountContatosComClientes.rows.length;

      if (quantContatos > 0) {
        rsCountPendenciasVendas.rows[i].contatou = true;
      } else {
        rsCountPendenciasVendas.rows[i].contatou = false;
      }
    }

    const response = {
      quantidade: countPendenciasEtapas,
      pendenciasVendas: rsCountPendenciasVendas.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaContatosFeitosParaCliente = async (req, res) => {
  let idCliente = req.params.idCliente;
  console.log("idcliente: " + idCliente);

  console.log("************** listaContatosFeitosParaCliente ****************");

  /********************************************************/
  let sqlCountVendedores =
    "SELECT TO_CHAR(c.datacontato,'DD/MM/YYYY') AS datacontato " +
    ', c.observacao, u."nomeUsuario", u."nomeUsuario" as nomeVendedor ' +
    'FROM "vendasPendentesFinalContatoFeitoClientes" c ' +
    " JOIN usuarios u on " +
    ' cast(c.idvendedor as INTEGER) = u."idUsuario" ' +
    " WHERE " +
    '     c."idcliente" = $1 ' +
    "ORDER BY " +
    '     c."datacontato"';

  console.log(sqlCountVendedores);
  /********************************************************/
  try {
    let rsCount = await pg.execute(sqlCountVendedores, [idCliente]);
    let countVendedores = rsCount.rows.length;

    const response = {
      quantidade: countVendedores,
      contatos: rsCount.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

//******************** soma pendencias da loja do gerente  ************************/
exports.listaSomaEtapasPorLoja = async (req, res) => {
  console.log(
    "-------------- listaSomaEtapasPorLoja(Gerente) ---------------------------------"
  );
  let idLoja = req.params.idLoja;
  console.log("idLoja ---------> " + idLoja);

  let sqlListaSomaEtapasPorLoja =
    "select " +
    "   SUM(etapa1) as etapa1, " +
    "   SUM(etapa2) as etapa2, " +
    "   SUM(etapa3) as etapa3, " +
    "   SUM(etapa4) as etapa4, " +
    "   SUM(etapa5) as etapa5, " +
    "   SUM(etapa6) as etapa6, " +
    "   SUM(etapa7) as etapa7, " +
    "   SUM(etapa8) as etapa8, " +
    "   SUM(etapa9) as etapa9, " +
    "   SUM(etapa10) as etapa10, " +
    "   SUM(etapafinal1) as etapafat1, " +
    "   SUM(etapafinal2) as etapafat2, " +
    "   SUM(etapafinal3) as etapafat3, " +
    "   SUM(etapafinal4) as etapafat4, " +
    "   SUM(etapafinal5) as etapafat5, " +
    "   SUM(etapafinal6) as etapafat6, " +
    "   SUM(etapafinal7) as etapafat7, " +
    "   SUM(etapafinal8) as etapafat8, " +
    "   SUM(etapafinal9) as etapafat9, " +
    "   SUM(etapafinal10) as etapafat10,  " +
    "   SUM(etapa1) + SUM(etapa2) + SUM(etapa3) + SUM(etapa4) + SUM(etapa5) + SUM(etapa6) + SUM(etapa7) + SUM(etapa8) + SUM(etapa9) + SUM(etapa10) as total_reais_pendencias, " +
    "   SUM(etapafinal1) + SUM(etapafinal2) + SUM(etapafinal3) + SUM(etapafinal4) + SUM(etapafinal5) + SUM(etapafinal6) + SUM(etapafinal7) + SUM(etapafinal8) + SUM(etapafinal9) + SUM(etapafinal10) as total_reais_faturadas, " +
    "   SUM(count_etapa1) as count_etapa1, " +
    "   SUM(count_etapa2) as count_etapa2, " +
    "   SUM(count_etapa3) as count_etapa3, " +
    "   SUM(count_etapa4) as count_etapa4, " +
    "   SUM(count_etapa5) as count_etapa5, " +
    "   SUM(count_etapa6) as count_etapa6, " +
    "   SUM(count_etapa7) as count_etapa7, " +
    "   SUM(count_etapa8) as count_etapa8, " +
    "   SUM(count_etapa9) as count_etapa9, " +
    "   SUM(count_etapa10) as count_etapa10, " +
    "   SUM(count_etapafinal1) as count_etapafinal1, " +
    "   SUM(count_etapafinal2) as count_etapafinal2, " +
    "   SUM(count_etapafinal3) as count_etapafinal3, " +
    "   SUM(count_etapafinal4) as count_etapafinal4, " +
    "   SUM(count_etapafinal5) as count_etapafinal5, " +
    "   SUM(count_etapafinal6) as count_etapafinal6, " +
    "   SUM(count_etapafinal7) as count_etapafinal7, " +
    "   SUM(count_etapafinal8) as count_etapafinal8, " +
    "   SUM(count_etapafinal9) as count_etapafinal9, " +
    "   SUM(count_etapafinal10) as count_etapafinal10, " +
    "   SUM(count_etapa1) + SUM(count_etapa2) + SUM(count_etapa3) + SUM(count_etapa4) + SUM(count_etapa5) + SUM(count_etapa6) + " +
    "   SUM(count_etapa7) + SUM(count_etapa8) + SUM(count_etapa9) + SUM(count_etapa10) as total_count_geral_pendencias, " +
    "   SUM(count_etapafinal1) + SUM(count_etapafinal2) + SUM(count_etapafinal3) + SUM(count_etapafinal4) + SUM(count_etapafinal5) + SUM(count_etapafinal6) +  " +
    "   SUM(count_etapafinal7) + SUM(count_etapafinal8) + SUM(count_etapafinal9) + SUM(count_etapafinal10) as total_count_geral_faturadas " +
    "from " +
    "   (select " +
    "   SUM(v.etapapend1) as etapa1, " +
    "   SUM(v.etapapend2) as etapa2, " +
    "   SUM(v.etapapend3) as etapa3, " +
    "   SUM(v.etapapend4) as etapa4, " +
    "   SUM(v.etapapend5) as etapa5, " +
    "   SUM(v.etapapend6) as etapa6, " +
    "   SUM(v.etapapend7) as etapa7, " +
    "   SUM(v.etapapend8) as etapa8, " +
    "   SUM(v.etapapend9) as etapa9, " +
    "   SUM(v.etapapend10) as etapa10, " +
    "   SUM(v.etapafinal1) as etapafinal1, " +
    "   SUM(v.etapafinal2) as etapafinal2, " +
    "   SUM(v.etapafinal3) as etapafinal3, " +
    "   SUM(v.etapafinal4) as etapafinal4, " +
    "   SUM(v.etapafinal5) as etapafinal5, " +
    "   SUM(v.etapafinal6) as etapafinal6, " +
    "   SUM(v.etapafinal7) as etapafinal7, " +
    "   SUM(v.etapafinal8) as etapafinal8, " +
    "   SUM(v.etapafinal9) as etapafinal9, " +
    "   SUM(v.etapafinal10) as etapafinal10, " +
    "   SUM(case when v.etapapend1 is not null and v.etapapend1 != 0 then 1 else 0 end) as count_etapa1, " +
    "   SUM(case when v.etapapend2 is not null and v.etapapend2 != 0 then 1 else 0 end) as count_etapa2, " +
    "   SUM(case when v.etapapend3 is not null and v.etapapend3 != 0 then 1 else 0 end) as count_etapa3, " +
    "   SUM(case when v.etapapend4 is not null and v.etapapend4 != 0 then 1 else 0 end) as count_etapa4, " +
    "   SUM(case when v.etapapend5 is not null and v.etapapend5 != 0 then 1 else 0 end) as count_etapa5, " +
    "   SUM(case when v.etapapend6 is not null and v.etapapend6 != 0 then 1 else 0 end) as count_etapa6, " +
    "   SUM(case when v.etapapend7 is not null and v.etapapend7 != 0 then 1 else 0 end) as count_etapa7, " +
    "   SUM(case when v.etapapend8 is not null and v.etapapend8 != 0 then 1 else 0 end) as count_etapa8, " +
    "   SUM(case when v.etapapend9 is not null and v.etapapend9 != 0 then 1 else 0 end) as count_etapa9, " +
    "   SUM(case when v.etapapend10 is not null and v.etapapend10 != 0 then 1 else 0 end) as count_etapa10, " +
    "   SUM(case when v.etapafinal1 is not null and v.etapafinal1 != 0 then 1 else 0 end) as count_etapafinal1, " +
    "   SUM(case when v.etapafinal2 is not null and v.etapafinal2 != 0 then 1 else 0 end) as count_etapafinal2, " +
    "   SUM(case when v.etapafinal3 is not null and v.etapafinal3 != 0 then 1 else 0 end) as count_etapafinal3, " +
    "   SUM(case when v.etapafinal4 is not null and v.etapafinal4 != 0 then 1 else 0 end) as count_etapafinal4, " +
    "   SUM(case when v.etapafinal5 is not null and v.etapafinal5 != 0 then 1 else 0 end) as count_etapafinal5, " +
    "   SUM(case when v.etapafinal6 is not null and v.etapafinal6 != 0 then 1 else 0 end) as count_etapafinal6, " +
    "   SUM(case when v.etapafinal7 is not null and v.etapafinal7 != 0 then 1 else 0 end) as count_etapafinal7, " +
    "   SUM(case when v.etapafinal8 is not null and v.etapafinal8 != 0 then 1 else 0 end) as count_etapafinal8, " +
    "   SUM(case when v.etapafinal9 is not null and v.etapafinal9 != 0 then 1 else 0 end) as count_etapafinal9, " +
    "   SUM(case when v.etapafinal10 is not null and v.etapafinal10 != 0 then 1 else 0 end) as count_etapafinal10 " +
    " FROM " +
    '     "vendasPendentesFinal" v ' +
    "   JOIN " +
    '     usuarios u ON   v.idvendedor = u."codigoVendedor" ' +
    "   JOIN " +
    '     lojas l ON u."idLoja" = l."idLoja" ' +
    "   WHERE " +
    '     l."idLoja" = $1 ) AS subquery';

  // let sqlListaSomaEtapasPorLoja =
  //   "SELECT " +
  //   "   SUM(etapa1) AS etapa1, " +
  //   "   SUM(etapa2) AS etapa2, " +
  //   "   SUM(etapa3) AS etapa3, " +
  //   "   SUM(etapa4) AS etapa4, " +
  //   "   SUM(etapa5) AS etapa5, " +
  //   "   SUM(etapa6) AS etapa6, " +
  //   "   SUM(etapa7) AS etapa7, " +
  //   "   SUM(etapa8) AS etapa8, " +
  //   "   SUM(etapa9) AS etapa9, " +
  //   "   SUM(etapa10) AS etapa10, " +
  //   "   SUM(etapa1) + SUM(etapa2) + SUM(etapa3) + SUM(etapa4) + SUM(etapa5) + SUM(etapa6) + SUM(etapa7) + SUM(etapa8) + SUM(etapa9) + SUM(etapa10) AS total " +
  //   "FROM ( " +
  //   "   SELECT " +
  //   "     SUM(v.etapapend1) AS etapa1, " +
  //   "     SUM(v.etapapend2) AS etapa2, " +
  //   "     SUM(v.etapapend3) AS etapa3, " +
  //   "     SUM(v.etapapend4) AS etapa4, " +
  //   "     SUM(v.etapapend5) AS etapa5, " +
  //   "     SUM(v.etapapend6) AS etapa6, " +
  //   "     SUM(v.etapapend7) AS etapa7, " +
  //   "     SUM(v.etapapend8) AS etapa8, " +
  //   "     SUM(v.etapapend9) AS etapa9, " +
  //   "   SUM(v.etapapend10) AS etapa10 " +
  //   "   FROM " +
  //   '     "vendasPendentesFinal" v ' +
  //   "   JOIN " +
  //   '     usuarios u ON   v.idvendedor = u."codigoVendedor" ' +
  //   "   JOIN " +
  //   '     lojas l ON u."idLoja" = l."idLoja" ' +
  //   "   WHERE " +
  //   '     l."idLoja" = $1 ) AS subquery';

  console.log(sqlListaSomaEtapasPorLoja);

  try {
    let rsSomaEtapasPorLoja = await pg.execute(sqlListaSomaEtapasPorLoja, [
      idLoja,
    ]);

    // const response = {
    //   somaEtapasPeloVendedor: rsSomaEtapasPeloVendedor.rows,
    //   total: rsSomaEtapasPeloVendedor.total,
    // };
    const response = {
      somaEtapasPorLoja: rsSomaEtapasPorLoja.rows,
      total: rsSomaEtapasPorLoja.total,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
};
exports.listaSomaEtapasPeloVendedor = async (req, res) => {
  console.log(
    "--------------- listaSomaEtapasPeloVendedor ---------------------"
  );
  let idVendedor = req.params.idVendedor;
  //console.log("idVendedor---------> " + idVendedor);

  let sqlListaSomaEtapasPeloVendedor =
    "select " +
    "   SUM(etapa1) as etapa1, " +
    "   SUM(etapa2) as etapa2, " +
    "   SUM(etapa3) as etapa3, " +
    "   SUM(etapa4) as etapa4, " +
    "   SUM(etapa5) as etapa5, " +
    "   SUM(etapa6) as etapa6, " +
    "   SUM(etapa7) as etapa7, " +
    "   SUM(etapa8) as etapa8, " +
    "   SUM(etapa9) as etapa9, " +
    "   SUM(etapa10) as etapa10, " +
    "   SUM(etapafinal1) as etapafat1, " +
    "   SUM(etapafinal2) as etapafat2, " +
    "   SUM(etapafinal3) as etapafat3, " +
    "   SUM(etapafinal4) as etapafat4, " +
    "   SUM(etapafinal5) as etapafat5, " +
    "   SUM(etapafinal6) as etapafat6, " +
    "   SUM(etapafinal7) as etapafat7, " +
    "   SUM(etapafinal8) as etapafat8, " +
    "   SUM(etapafinal9) as etapafat9, " +
    "   SUM(etapafinal10) as etapafat10,  " +
    "   SUM(etapa1) + SUM(etapa2) + SUM(etapa3) + SUM(etapa4) + SUM(etapa5) + SUM(etapa6) + SUM(etapa7) + SUM(etapa8) + SUM(etapa9) + SUM(etapa10) as total_reais_pendencias, " +
    "   SUM(etapafinal1) + SUM(etapafinal2) + SUM(etapafinal3) + SUM(etapafinal4) + SUM(etapafinal5) + SUM(etapafinal6) + SUM(etapafinal7) + SUM(etapafinal8) + SUM(etapafinal9) + SUM(etapafinal10) as total_reais_faturadas, " +
    "   SUM(count_etapa1) as count_etapa1, " +
    "   SUM(count_etapa2) as count_etapa2, " +
    "   SUM(count_etapa3) as count_etapa3, " +
    "   SUM(count_etapa4) as count_etapa4, " +
    "   SUM(count_etapa5) as count_etapa5, " +
    "   SUM(count_etapa6) as count_etapa6, " +
    "   SUM(count_etapa7) as count_etapa7, " +
    "   SUM(count_etapa8) as count_etapa8, " +
    "   SUM(count_etapa9) as count_etapa9, " +
    "   SUM(count_etapa10) as count_etapa10, " +
    "   SUM(count_etapafinal1) as count_etapafinal1, " +
    "   SUM(count_etapafinal2) as count_etapafinal2, " +
    "   SUM(count_etapafinal3) as count_etapafinal3, " +
    "   SUM(count_etapafinal4) as count_etapafinal4, " +
    "   SUM(count_etapafinal5) as count_etapafinal5, " +
    "   SUM(count_etapafinal6) as count_etapafinal6, " +
    "   SUM(count_etapafinal7) as count_etapafinal7, " +
    "   SUM(count_etapafinal8) as count_etapafinal8, " +
    "   SUM(count_etapafinal9) as count_etapafinal9, " +
    "   SUM(count_etapafinal10) as count_etapafinal10, " +
    "   SUM(count_etapa1) + SUM(count_etapa2) + SUM(count_etapa3) + SUM(count_etapa4) + SUM(count_etapa5) + SUM(count_etapa6) + " +
    "   SUM(count_etapa7) + SUM(count_etapa8) + SUM(count_etapa9) + SUM(count_etapa10) as total_count_geral_pendencias, " +
    "   SUM(count_etapafinal1) + SUM(count_etapafinal2) + SUM(count_etapafinal3) + SUM(count_etapafinal4) + SUM(count_etapafinal5) + SUM(count_etapafinal6) +  " +
    "   SUM(count_etapafinal7) + SUM(count_etapafinal8) + SUM(count_etapafinal9) + SUM(count_etapafinal10) as total_count_geral_faturadas " +
    "from " +
    "   (select " +
    "   SUM(v.etapapend1) as etapa1, " +
    "   SUM(v.etapapend2) as etapa2, " +
    "   SUM(v.etapapend3) as etapa3, " +
    "   SUM(v.etapapend4) as etapa4, " +
    "   SUM(v.etapapend5) as etapa5, " +
    "   SUM(v.etapapend6) as etapa6, " +
    "   SUM(v.etapapend7) as etapa7, " +
    "   SUM(v.etapapend8) as etapa8, " +
    "   SUM(v.etapapend9) as etapa9, " +
    "   SUM(v.etapapend10) as etapa10, " +
    "   SUM(v.etapafinal1) as etapafinal1, " +
    "   SUM(v.etapafinal2) as etapafinal2, " +
    "   SUM(v.etapafinal3) as etapafinal3, " +
    "   SUM(v.etapafinal4) as etapafinal4, " +
    "   SUM(v.etapafinal5) as etapafinal5, " +
    "   SUM(v.etapafinal6) as etapafinal6, " +
    "   SUM(v.etapafinal7) as etapafinal7, " +
    "   SUM(v.etapafinal8) as etapafinal8, " +
    "   SUM(v.etapafinal9) as etapafinal9, " +
    "   SUM(v.etapafinal10) as etapafinal10, " +
    "   SUM(case when v.etapapend1 is not null and v.etapapend1 != 0 then 1 else 0 end) as count_etapa1, " +
    "   SUM(case when v.etapapend2 is not null and v.etapapend2 != 0 then 1 else 0 end) as count_etapa2, " +
    "   SUM(case when v.etapapend3 is not null and v.etapapend3 != 0 then 1 else 0 end) as count_etapa3, " +
    "   SUM(case when v.etapapend4 is not null and v.etapapend4 != 0 then 1 else 0 end) as count_etapa4, " +
    "   SUM(case when v.etapapend5 is not null and v.etapapend5 != 0 then 1 else 0 end) as count_etapa5, " +
    "   SUM(case when v.etapapend6 is not null and v.etapapend6 != 0 then 1 else 0 end) as count_etapa6, " +
    "   SUM(case when v.etapapend7 is not null and v.etapapend7 != 0 then 1 else 0 end) as count_etapa7, " +
    "   SUM(case when v.etapapend8 is not null and v.etapapend8 != 0 then 1 else 0 end) as count_etapa8, " +
    "   SUM(case when v.etapapend9 is not null and v.etapapend9 != 0 then 1 else 0 end) as count_etapa9, " +
    "   SUM(case when v.etapapend10 is not null and v.etapapend10 != 0 then 1 else 0 end) as count_etapa10, " +
    "   SUM(case when v.etapafinal1 is not null and v.etapafinal1 != 0 then 1 else 0 end) as count_etapafinal1, " +
    "   SUM(case when v.etapafinal2 is not null and v.etapafinal2 != 0 then 1 else 0 end) as count_etapafinal2, " +
    "   SUM(case when v.etapafinal3 is not null and v.etapafinal3 != 0 then 1 else 0 end) as count_etapafinal3, " +
    "   SUM(case when v.etapafinal4 is not null and v.etapafinal4 != 0 then 1 else 0 end) as count_etapafinal4, " +
    "   SUM(case when v.etapafinal5 is not null and v.etapafinal5 != 0 then 1 else 0 end) as count_etapafinal5, " +
    "   SUM(case when v.etapafinal6 is not null and v.etapafinal6 != 0 then 1 else 0 end) as count_etapafinal6, " +
    "   SUM(case when v.etapafinal7 is not null and v.etapafinal7 != 0 then 1 else 0 end) as count_etapafinal7, " +
    "   SUM(case when v.etapafinal8 is not null and v.etapafinal8 != 0 then 1 else 0 end) as count_etapafinal8, " +
    "   SUM(case when v.etapafinal9 is not null and v.etapafinal9 != 0 then 1 else 0 end) as count_etapafinal9, " +
    "   SUM(case when v.etapafinal10 is not null and v.etapafinal10 != 0 then 1 else 0 end) as count_etapafinal10 " +
    " FROM " +
    '     "vendasPendentesFinal" v ' +
    "   JOIN " +
    '     usuarios u ON   v.idvendedor = u."codigoVendedor" ' +
    "   JOIN " +
    '     lojas l ON u."idLoja" = l."idLoja" ' +
    "   WHERE " +
    "     v.idvendedor = $1 ) AS subquery";

  console.log(sqlListaSomaEtapasPeloVendedor);

  try {
    let rsSomaEtapasPeloVendedor = await pg.execute(
      sqlListaSomaEtapasPeloVendedor,
      [idVendedor]
    );

    let countSomaPendencias = rsSomaEtapasPeloVendedor.rows.length;
    console.log("************** total pedencias: " + countSomaPendencias);

    const response = {
      somaEtapasPeloVendedor: rsSomaEtapasPeloVendedor.rows,
      total: rsSomaEtapasPeloVendedor.total,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
};
exports.filtrarVendedores = async (req, res) => {
  let idLoja = req.params.idLoja;
  let loja = req.query.loja;
  let cliente = req.query.cliente;
  let ativo = "S";

  console.log("************** ROTA COUNT INDICADORES ****************");
  console.log("idloja: " + idLoja);

  /********************************************************/
  let sqlCountVendedores =
    "SELECT " +
    '     u."idUsuario" , u."idLoja" , u."idNivelUsuario" , u."codigoVendedor" , u."nomeUsuario"  ' +
    "FROM " +
    "     usuarios u " +
    " WHERE " +
    '     u."idNivelUsuario" = 3 ' +
    "AND " +
    "     u.ativo = $1 " +
    "AND " +
    '     u."idLoja" = $2 ' +
    "ORDER BY " +
    '     u."nomeUsuario"';

  console.log(sqlCountVendedores);
  /********************************************************/
  try {
    let rsCount = await pg.execute(sqlCountVendedores, [ativo, idLoja]);
    let countVendedores = rsCount.rows.length;

    const response = {
      quantidade: countVendedores,
      vendedores: rsCount.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.salvarObervacao = async (req, res) => {
  const dataContato = new moment().format("YYYY-MM-DD HH:mm:ss");
  let contatou = true;
  console.log(req.body);
  const contatof = req.body;
  try {
    const sql =
      'INSERT INTO "vendasPendentesFinalContatoFeitoClientes" (datacontato, idvendedor, idcliente, observacao, contatou) ' +
      "values ($1,$2,$3,$4,$5) RETURNING idcontato";
    const rs = await pg.execute(sql, [
      dataContato,
      contatof.idVendedor,
      contatof.idCliente,
      contatof.observacao,
      contatou,
    ]);
    const response = {
      mensagem: "Contato cadastrado com sucesso",
      perfil: {
        idcontato: rs.rows[0].idcontato,
        dataContato,
      },
    };
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(401).send("tabela: " + error.table + " campo: " + error.column);
  }
};

///************************** pendencias admin geral ************************/
exports.listaAdminPendenciasPorLoja = async (req, res) => {
  console.log(
    "-------------------------------- listaAdminPendenciasPorLoja ---------------------------------"
  );
  let idUsuario = req.params.idUsuario;
  //console.log("idVendedor---------> " + idVendedor);

  let sqlAdminListaPendenciasEtapasVendedores =
    "SELECT " +
    '   l."codigoLoja" AS CODIGOLOJA, ' +
    '   l."fantasia" ,' +
    '   l."idLoja" , ' +
    "   SUM(ETAPAPEND1) + SUM(ETAPAPEND2) + SUM(ETAPAPEND3) + SUM(ETAPAPEND4) + SUM(ETAPAPEND5) + " +
    "   SUM(ETAPAPEND6) + SUM(ETAPAPEND7) + SUM(ETAPAPEND8) + SUM(ETAPAPEND9) + SUM(ETAPAPEND10) AS totalvendas, " +
    "   SUM(v.ETAPAPEND1) AS etapa1, " +
    "   SUM(v.ETAPAPEND2) AS etapa2, " +
    "   SUM(v.ETAPAPEND3) AS etapa3, " +
    "   SUM(v.ETAPAPEND4) AS etapa4, " +
    "   SUM(v.ETAPAPEND5) AS etapa5, " +
    "   SUM(v.ETAPAPEND6) AS etapa6, " +
    "   SUM(v.ETAPAPEND7) AS etapa7, " +
    "   SUM(v.ETAPAPEND8) AS etapa8, " +
    "   SUM(v.ETAPAPEND9) AS etapa9, " +
    "   SUM(v.ETAPAPEND10) AS etapa10 " +
    "FROM " +
    '     "vendasPendentesFinal" v ' +
    "   JOIN " +
    '     usuarios u ON   v.idvendedor = u."codigoVendedor" ' +
    "   JOIN " +
    '     lojas l ON u."idLoja" = l."idLoja" ' +
    "   LEFT JOIN  " +
    '     "vendasPendentesFinalContatoFeitoClientes" C ON V.IDCLIENTE = C.IDCLIENTE ' +
    "   GROUP BY " +
    '     l."codigoLoja", l."idLoja" ';

  console.log(sqlAdminListaPendenciasEtapasVendedores);
  /********************************************************/
  try {
    let rsAdminCountPendenciasVendas = await pg.execute(
      sqlAdminListaPendenciasEtapasVendedores
    );
    let countAdminPendenciasEtapas = rsAdminCountPendenciasVendas.rows.length;
    console.warn(countAdminPendenciasEtapas);

    const response = {
      quantidade: countAdminPendenciasEtapas,
      pendenciasAdminVendas: rsAdminCountPendenciasVendas.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
///************************** soma pendencias admin geral ************************/
///************************** soma pendencias admin geral ************************/
exports.listaAdminSomaPendenciasPorLoja = async (req, res) => {
  console.log(
    "-------------- listaAdminSomaPendenciasPorLoja(Admin) ---------------------------------xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  );
  let idUsuario = req.params.idUsuario;
  console.log("idUsuario ---------> " + idUsuario);

  let sqlListaAdminSomaEtapasPorLoja =
    "select " +
    "   SUM(etapa1) as etapa1, " +
    "   SUM(etapa2) as etapa2, " +
    "   SUM(etapa3) as etapa3, " +
    "   SUM(etapa4) as etapa4, " +
    "   SUM(etapa5) as etapa5, " +
    "   SUM(etapa6) as etapa6, " +
    "   SUM(etapa7) as etapa7, " +
    "   SUM(etapa8) as etapa8, " +
    "   SUM(etapa9) as etapa9, " +
    "   SUM(etapa10) as etapa10, " +
    "   SUM(etapafinal1) as etapafat1, " +
    "   SUM(etapafinal2) as etapafat2, " +
    "   SUM(etapafinal3) as etapafat3, " +
    "   SUM(etapafinal4) as etapafat4, " +
    "   SUM(etapafinal5) as etapafat5, " +
    "   SUM(etapafinal6) as etapafat6, " +
    "   SUM(etapafinal7) as etapafat7, " +
    "   SUM(etapafinal8) as etapafat8, " +
    "   SUM(etapafinal9) as etapafat9, " +
    "   SUM(etapafinal10) as etapafat10,  " +
    "   SUM(etapa1) + SUM(etapa2) + SUM(etapa3) + SUM(etapa4) + SUM(etapa5) + SUM(etapa6) + SUM(etapa7) + SUM(etapa8) + SUM(etapa9) + SUM(etapa10) as total_reais_pendencias, " +
    "   SUM(etapafinal1) + SUM(etapafinal2) + SUM(etapafinal3) + SUM(etapafinal4) + SUM(etapafinal5) + SUM(etapafinal6) + SUM(etapafinal7) + SUM(etapafinal8) + SUM(etapafinal9) + SUM(etapafinal10) as total_reais_faturadas, " +
    "   SUM(count_etapa1) as count_etapa1, " +
    "   SUM(count_etapa2) as count_etapa2, " +
    "   SUM(count_etapa3) as count_etapa3, " +
    "   SUM(count_etapa4) as count_etapa4, " +
    "   SUM(count_etapa5) as count_etapa5, " +
    "   SUM(count_etapa6) as count_etapa6, " +
    "   SUM(count_etapa7) as count_etapa7, " +
    "   SUM(count_etapa8) as count_etapa8, " +
    "   SUM(count_etapa9) as count_etapa9, " +
    "   SUM(count_etapa10) as count_etapa10, " +
    "   SUM(count_etapafinal1) as count_etapafinal1, " +
    "   SUM(count_etapafinal2) as count_etapafinal2, " +
    "   SUM(count_etapafinal3) as count_etapafinal3, " +
    "   SUM(count_etapafinal4) as count_etapafinal4, " +
    "   SUM(count_etapafinal5) as count_etapafinal5, " +
    "   SUM(count_etapafinal6) as count_etapafinal6, " +
    "   SUM(count_etapafinal7) as count_etapafinal7, " +
    "   SUM(count_etapafinal8) as count_etapafinal8, " +
    "   SUM(count_etapafinal9) as count_etapafinal9, " +
    "   SUM(count_etapafinal10) as count_etapafinal10, " +
    "   SUM(count_etapa1) + SUM(count_etapa2) + SUM(count_etapa3) + SUM(count_etapa4) + SUM(count_etapa5) + SUM(count_etapa6) + " +
    "   SUM(count_etapa7) + SUM(count_etapa8) + SUM(count_etapa9) + SUM(count_etapa10) as total_count_geral_pendencias, " +
    "   SUM(count_etapafinal1) + SUM(count_etapafinal2) + SUM(count_etapafinal3) + SUM(count_etapafinal4) + SUM(count_etapafinal5) + SUM(count_etapafinal6) +  " +
    "   SUM(count_etapafinal7) + SUM(count_etapafinal8) + SUM(count_etapafinal9) + SUM(count_etapafinal10) as total_count_geral_faturadas " +
    "from " +
    "   (select " +
    "   SUM(v.etapapend1) as etapa1, " +
    "   SUM(v.etapapend2) as etapa2, " +
    "   SUM(v.etapapend3) as etapa3, " +
    "   SUM(v.etapapend4) as etapa4, " +
    "   SUM(v.etapapend5) as etapa5, " +
    "   SUM(v.etapapend6) as etapa6, " +
    "   SUM(v.etapapend7) as etapa7, " +
    "   SUM(v.etapapend8) as etapa8, " +
    "   SUM(v.etapapend9) as etapa9, " +
    "   SUM(v.etapapend10) as etapa10, " +
    "   SUM(v.etapafinal1) as etapafinal1, " +
    "   SUM(v.etapafinal2) as etapafinal2, " +
    "   SUM(v.etapafinal3) as etapafinal3, " +
    "   SUM(v.etapafinal4) as etapafinal4, " +
    "   SUM(v.etapafinal5) as etapafinal5, " +
    "   SUM(v.etapafinal6) as etapafinal6, " +
    "   SUM(v.etapafinal7) as etapafinal7, " +
    "   SUM(v.etapafinal8) as etapafinal8, " +
    "   SUM(v.etapafinal9) as etapafinal9, " +
    "   SUM(v.etapafinal10) as etapafinal10, " +
    "   SUM(case when v.etapapend1 is not null and v.etapapend1 != 0 then 1 else 0 end) as count_etapa1, " +
    "   SUM(case when v.etapapend2 is not null and v.etapapend2 != 0 then 1 else 0 end) as count_etapa2, " +
    "   SUM(case when v.etapapend3 is not null and v.etapapend3 != 0 then 1 else 0 end) as count_etapa3, " +
    "   SUM(case when v.etapapend4 is not null and v.etapapend4 != 0 then 1 else 0 end) as count_etapa4, " +
    "   SUM(case when v.etapapend5 is not null and v.etapapend5 != 0 then 1 else 0 end) as count_etapa5, " +
    "   SUM(case when v.etapapend6 is not null and v.etapapend6 != 0 then 1 else 0 end) as count_etapa6, " +
    "   SUM(case when v.etapapend7 is not null and v.etapapend7 != 0 then 1 else 0 end) as count_etapa7, " +
    "   SUM(case when v.etapapend8 is not null and v.etapapend8 != 0 then 1 else 0 end) as count_etapa8, " +
    "   SUM(case when v.etapapend9 is not null and v.etapapend9 != 0 then 1 else 0 end) as count_etapa9, " +
    "   SUM(case when v.etapapend10 is not null and v.etapapend10 != 0 then 1 else 0 end) as count_etapa10, " +
    "   SUM(case when v.etapafinal1 is not null and v.etapafinal1 != 0 then 1 else 0 end) as count_etapafinal1, " +
    "   SUM(case when v.etapafinal2 is not null and v.etapafinal2 != 0 then 1 else 0 end) as count_etapafinal2, " +
    "   SUM(case when v.etapafinal3 is not null and v.etapafinal3 != 0 then 1 else 0 end) as count_etapafinal3, " +
    "   SUM(case when v.etapafinal4 is not null and v.etapafinal4 != 0 then 1 else 0 end) as count_etapafinal4, " +
    "   SUM(case when v.etapafinal5 is not null and v.etapafinal5 != 0 then 1 else 0 end) as count_etapafinal5, " +
    "   SUM(case when v.etapafinal6 is not null and v.etapafinal6 != 0 then 1 else 0 end) as count_etapafinal6, " +
    "   SUM(case when v.etapafinal7 is not null and v.etapafinal7 != 0 then 1 else 0 end) as count_etapafinal7, " +
    "   SUM(case when v.etapafinal8 is not null and v.etapafinal8 != 0 then 1 else 0 end) as count_etapafinal8, " +
    "   SUM(case when v.etapafinal9 is not null and v.etapafinal9 != 0 then 1 else 0 end) as count_etapafinal9, " +
    "   SUM(case when v.etapafinal10 is not null and v.etapafinal10 != 0 then 1 else 0 end) as count_etapafinal10 " +
    "FROM " +
    '     "vendasPendentesFinal" v ' +
    "   JOIN " +
    '     usuarios u ON   v.idvendedor = u."codigoVendedor" ' +
    "   JOIN " +
    '     lojas l ON u."idLoja" = l."idLoja") AS subquery';
  // let sqlListaAdminSomaEtapasPorLoja =
  //   "SELECT " +
  //   "   SUM(etapa1) AS etapa1, " +
  //   "   SUM(etapa2) AS etapa2, " +
  //   "   SUM(etapa3) AS etapa3, " +
  //   "   SUM(etapa4) AS etapa4, " +
  //   "   SUM(etapa5) AS etapa5, " +
  //   "   SUM(etapa6) AS etapa6, " +
  //   "   SUM(etapa7) AS etapa7, " +
  //   "   SUM(etapa8) AS etapa8, " +
  //   "   SUM(etapa9) AS etapa9, " +
  //   "   SUM(etapa10) AS etapa10, " +
  //   "   SUM(etapa1) + SUM(etapa2) + SUM(etapa3) + SUM(etapa4) + SUM(etapa5) + SUM(etapa6) + SUM(etapa7) + SUM(etapa8) + SUM(etapa9) + SUM(etapa10) AS total " +
  //   "FROM ( " +
  //   "   SELECT " +
  //   "     SUM(v.etapapend1) AS etapa1, " +
  //   "     SUM(v.etapapend2) AS etapa2, " +
  //   "     SUM(v.etapapend3) AS etapa3, " +
  //   "     SUM(v.etapapend4) AS etapa4, " +
  //   "     SUM(v.etapapend5) AS etapa5, " +
  //   "     SUM(v.etapapend6) AS etapa6, " +
  //   "     SUM(v.etapapend7) AS etapa7, " +
  //   "     SUM(v.etapapend8) AS etapa8, " +
  //   "     SUM(v.etapapend9) AS etapa9, " +
  //   "   SUM(v.etapapend10) AS etapa10 " +
  //   "   FROM " +
  //   '     "vendasPendentesFinal" v ' +
  //   "   JOIN " +
  //   '     usuarios u ON   v.idvendedor = u."codigoVendedor" ' +
  //   "   JOIN " +
  //   '     lojas l ON u."idLoja" = l."idLoja") AS subquery';

  console.log(sqlListaAdminSomaEtapasPorLoja);

  try {
    let rsSomaEtapasPorLoja = await pg.execute(sqlListaAdminSomaEtapasPorLoja);

    const response = {
      somaEtapasPorLoja: rsSomaEtapasPorLoja.rows,
      total: rsSomaEtapasPorLoja.total,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
};
