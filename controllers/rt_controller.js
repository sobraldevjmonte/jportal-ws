const pg = require("../conexao");
const pg_proj_jmonte = require("../conexao_prof_jmonte");
const moment = require("moment");

//******************** mes/ano  *************************/
// let dataAtual = new Date();
// let mesAtual = dataAtual.getMonth();
// let anoAtual = dataAtual.getFullYear();

// //****************************************************/
// if (mesAtual == 1) {
//   mesAtual = 12;
//   anoAtual = anoAtual - 1;
// }

// console.log("O mês atual é:", mesAtual);
// console.log("O ano atual é:", anoAtual);
//--------------------- LISTA CATEGORIAS --------------------
exports.listaCountIndicadores = async (req, res) => {
  let page = req.query.page ?? 1;
  let limit = req.query.limit;
  let mes = req.query.mes;
  let ano = req.query.ano;
  let fPgto = req.query.f_pgto;
  let indicador = req.query.indicador;
  let loja = req.query.loja;
  let cliente = req.query.cliente;
  let categProfissional = req.query.cat_prof;

  let lastPage = 1;
  let offSet = Number(page * limit - limit);

  //-------------------- SQLs ----------------------------------
  sqlClientes = " JOIN vw_clientes vc ON pv.np = vc.np AND vc.";
  sqlFormaPgto = " AND p.plano_pre = $4 ";
  sqlIndicadores = " AND p.cod_indica_pre = $5 ";
  sqlCatProfissionais =
    " AND (p.cod_indica_pre = ind.cod_indica AND ind.grupo_indica = gi.cod_grupo) AND gi.cod_grupo = $6 ";

  //-------------------- SQLs ----------------------------------

  console.log("limit: " + limit);
  console.log("offSet: " + offSet);
  console.log("page: " + page);
  console.log("lastPage: " + lastPage);
  console.log("mes: " + mes);
  console.log("ano: " + ano);
  console.log("fPgto: " + fPgto);
  console.log("indicador: " + indicador);
  console.log("loja: " + loja);
  console.log("cliente: " + cliente);
  console.log("categProfissional: " + categProfissional);

  console.log("************** ROTA COUNT INDICADORES ****************");

  /********************************************************/
  let sqlCountIndicadores =
    "SELECT " +
    "   distinct(i.cod_indica_pre), " +
    "   i.indicador, " +
    "   i.telefone, " +
    "   i.grupo, " +
    "   ti.vlr_total as total " +
    "FROM " +
    "   vw_indicadores i " +
    "JOIN vw_total_indicadores ti ON " +
    "   i.cod_indica_pre = ti.cod_indica_pre " +
    "JOIN vw_prevendas pv ON " +
    "   i.cod_indica_pre = pv.cod_indica_pre " /*sqlClientes*/ +
    " JOIN vw_clientes vc ON pv.np = vc.np " +
    "WHERE " +
    "   pv.mes = $1 " +
    "AND " +
    "   pv.ano = $2 " +
    "ORDER BY " +
    "    i.cod_indica_pre " +
    "OFFSET $3 " +
    "limit $4 limit 5";

  console.log(sqlCountIndicadores);
  /********************************************************/
  try {
    let rsCount = await pg.execute(sqlCountIndicadores, [
      mes,
      ano,
      offSet,
      limit,
    ]);

    console.log("************* linha 67 ******************");
    let countIndicadores = rsCount.rows.length;
    console.log("************* linha 69 ******************");
    console.log("countIndicadores: " + countIndicadores);
    if (countIndicadores > 0) {
      lastPage = Math.ceil(countIndicadores / limit);
    }
    console.log("lastPageF: " + lastPage);
    const response = {
      quantidade: countIndicadores,
      page,
      prev_page_url: page - 1 >= 1 ? page - 1 : false,
      next_page_url:
        Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
      lastPage,
      indicadores: rsCount.rows,
    };
    console.log("-------- LISTA INDICADORES -------");
    res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaIndicadores = async (req, res) => {
  let page = req.query.page ?? 1;
  let limit = req.query.limit;
  let mesFiltro = req.params.mes;
  let anoFiltro = req.params.ano;
  let loja = req.params.loja;
  // if (mes == "") {
  //   mes = mesAtual;
  // }
  // let ano = req.params.ano;
  // if (ano == "") {
  //   ano = anoAtual;
  // }
  let fPgto = req.query.f_pgto;
  let indicador = req.query.indicador;
  
  let cliente = req.query.cliente;
  let categProfissional = req.query.cat_prof;

  let lastPage = 1;
  let offSet = Number(page * limit - limit);

  //-------------------- SQLs ----------------------------------
  sqlClientes = " JOIN vw_clientes vc ON pv.np = vc.np AND vc.";
  sqlFormaPgto = " AND p.plano_pre = $4 ";
  sqlIndicadores = " AND p.cod_indica_pre = $5 ";
  sqlCatProfissionais =
    " AND (p.cod_indica_pre = ind.cod_indica AND ind.grupo_indica = gi.cod_grupo) AND gi.cod_grupo = $6 ";

  //-------------------- SQLs ----------------------------------

  console.log("limit: " + limit);
  console.log("offSet: " + offSet);
  console.log("page: " + page);
  console.log("lastPage: " + lastPage);
  console.log("mes(listaIndicadores): " + mesFiltro);
  console.log("ano(listaIndicadores): " + anoFiltro);
  console.log("fPgto: " + fPgto);
  console.log("indicador: " + indicador);
  console.log("loja: " + loja);
  console.log("cliente: " + cliente);
  console.log("categProfissional: " + categProfissional);

  console.log("************** ROTA INDICADORES ****************");

  /********************************************************/
  let vazio = "";
  let planoNaoEntra = "061";
  let finalizado = "Finalizado";
  let sqlListaIndicadores =
    "SELECT " +
    "   DISTINCT(pp.cod_indica_pre), " +
    "   ROW_NUMBER() OVER () AS key , " +
    "   round(SUM(pp.vlr_total) , 2) as ptotal, " +
    "   round(SUM(pp.vlr_tabela), 2) as total_vlr_tabela, " +
    "   round(((SUM(pp.vlr_lucro_bruto)/ SUM(pp.vlr_total))) * 100, 2) as total_lb_percentual, " +
    "   round((SUM(pp.vlr_fator_financeiro)/ SUM(pp.vlr_total)) * 100 , 2) as vlr_fator_financeiro, " +
    "   round(((SUM(pp.vlr_lucro_bruto) + SUM(pp.vlr_fator_financeiro))/ SUM(pp.vlr_total)) * 100 , 2) as vlr_lb_fator_financeiro, " +
    "   round(((SUM(pp.vlr_tabela) - SUM(pp.vlr_total))/ SUM(pp.vlr_tabela)) * 100 , 2) as vlr_diff_tab, " +
    "   round(SUM(pp.vlr_total -  pp.vlr_fator_financeiro ), 2) as total_vlr_base_pp_lista, " +
    "   round(((SUM(pp.vlr_total -  pp.vlr_fator_financeiro ) * ind.perc_rep) / 100), 2)  as valor_pp, " +
    "   ind.indicador, " +
    "   ind.perc_rep as percentual_repasse, " +
    "   ft.vl_atual " +
    "FROM  " +
    "   fprevendas pp " +
    "JOIN " +
    "   dindicadores ind ON pp.cod_indica_pre = ind.cod_indica " +
    "LEFT JOIN " +
    "   fprevendas_totais ft ON " +
    "   pp.cod_indica_pre  = ft.cod_indica_pre AND ft.periodo = $6 " +
    "WHERE " +
    "   EXTRACT(month FROM (SELECT pp.data_pre)) = $3 " +
    "AND " +
    "   EXTRACT(year FROM (SELECT pp.data_pre)) = $4 " +
    "AND " +
    "   pp.cod_indica_pre is not null " +
    "AND  " +
    "   pp.cod_indica_pre != $1 " +
    "AND " +
    "   pp.plano_pre != $2 " +
    "AND " +
    "   pp.cod_cliente_pre != $1 " +
    "AND " +
    "   pp.status = $5 " +
    "AND " +
    "   pp.cod_loja_pre = $7 " +
    "GROUP BY " +
    "   pp.cod_indica_pre, ind.indicador, ft.vl_atual, ind.perc_rep " +
    "ORDER BY " +
    "   pp.cod_indica_pre LIMIT 5";

  console.log(sqlListaIndicadores);
  /********************************************************/
  const periodo = anoFiltro + "" + mesFiltro;
  try {
    const result = await pg.execute(sqlListaIndicadores, [
      vazio,
      planoNaoEntra,
      mesFiltro,
      anoFiltro,
      finalizado,
      periodo,
      loja
    ]);
    //
    let countIndicadores = result.rows.length;

    // console.log("++++++++++++++++++++++ linha 189 ++++++++++++++++++++");
    for (let i = 0; i < countIndicadores; i++) {
      // console.log(
      //   periodo +
      //     " " +
      //     result.rows[i].cod_indica_pre +
      //     " " +
      //     result.rows[i].ptotal +
      //     " " +
      //     result.rows[i].vl_atual
      // );
      // console.log("----------- linha 189 ------------------");
      let vl = result.rows[i].vl_atual;
      if (vl === null) {
        // console.log("----------- linha 192 ------------------");
        result.rows[i].vl_atual = result.rows[i].ptotal;
        let sqlInsertValorTotal =
          "INSERT INTO " +
          "fprevendas_totais " +
          "(periodo, cod_indica_pre, vl_original, vl_atual, pago ) " +
          "VALUES ($1, $2, $3, $4, $5)";
        try {
          await pg.execute(sqlInsertValorTotal, [
            periodo,
            result.rows[i].cod_indica_pre,
            result.rows[i].ptotal,
            result.rows[i].ptotal,
            false,
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    }

    // if (countIndicadores > 0) {
    //   lastPage = Math.ceil(countIndicadores / limit);
    // }
    // console.log("lastPageF: " + lastPage);

    const response = {
      quantidade: result.rows.length,
      //page,
      //prev_page_url: page - 1 >= 1 ? page - 1 : false,
      //next_page_url:
      //  Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
      //lastPage,
      indicadores: result.rows,
    };
    console.log("-------- LISTA INDICADORES -------");
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaPreVendas = async (req, res) => {
  let mes = req.params.mes;
  let ano = req.params.ano;
  let loja = req.params.loja;
  let indicador = req.params.indicador;

  let vazio = "";
  let planoNaoEntra = "061";
  let finalizado = "Finalizado";

  console.log("************** LISTA PRE-VENDAS ****************");
  console.log("mes(listaPreVendas): " + mes);
  console.log("ano(listaPreVendas): " + ano);
  console.log("loja(listaPreVendas): " + loja);

  let sqlListaPreVendas =
    "SELECT " +
    "   DISTINCT(PP.NP) AS NP, " +
    "   ROW_NUMBER() OVER () AS key , " +
    "   TO_CHAR(PP.DATA_PRE, 'DD/MM/YYYY') as data_pre, " +
    "   PP.tabela, " +
    "   round(SUM(pp.comissao) , 2) AS comissao, " +
    "   round(SUM(pp.perc_ap) , 2) AS perc_ap, " +
    "   round(SUM(pp.vlr_total) , 2) as ptotal, " +
    "   round(SUM(pp.vlr_tabela), 2) as total_vlr_tabela, " +
    "   round(((SUM(pp.vlr_lucro_bruto)/ SUM(pp.vlr_total))) * 100, 2) as total_lb_percentual, " +
    "   round((SUM(pp.vlr_fator_financeiro)/ SUM(pp.vlr_total)) * 100 , 2) as vlr_fator_financeiro, " +
    "   round(((SUM(pp.vlr_lucro_bruto) + SUM(pp.vlr_fator_financeiro))/ SUM(pp.vlr_total)) * 100 , 2) as vlr_lb_fator_financeiro, " +
    "   round(((SUM(pp.vlr_tabela) - SUM(pp.vlr_total))/ SUM(pp.vlr_tabela)) * 100 , 2) as vlr_diff_tab, " +
    "   round(SUM(pp.vlr_total -  pp.vlr_fator_financeiro ), 2) as total_vlr_base_pp_lista, " +
    "   round(((SUM(pp.vlr_total -  pp.vlr_fator_financeiro ) * ind.perc_rep) / 100), 2)  as valor_pp, " +
    "   C.CLIENTE AS nome_cliente, " +
    "   v.vendedor, " +
    "   l.loja, " +
    "   d.plano " +
    "FROM  " +
    "FPREVENDAS PP  " +
    "   JOIN   " +
    "     DINDICADORES IND ON  " +
    "       PP.COD_INDICA_PRE = IND.COD_INDICA " +
    "   JOIN " +
    "     dclientes c on " +
    "       c.codcliente = pp.COD_CLIENTE_PRE " +
    "   JOIN " +
    "     dvendedores v ON " +
    "       v.codvendedor = pp.cod_vendedor_pre " +
    "   JOIN " +
    "     dlojas l ON " +
    "       pp.cod_loja_pre  = CAST(l.codloja  as INTEGER) " +
    "   JOIN " +
    "     dplanos d ON " +
    "       pp.plano_pre = d.cod_plano " +
    "WHERE " +
    "   EXTRACT(MONTH FROM (SELECT PP.DATA_PRE)) = $4 " +
    "AND  " +
    "   EXTRACT(YEAR FROM (SELECT PP.DATA_PRE)) = $5 " +
    "AND   " +
    "  PP.PLANO_PRE != $3 " +
    "AND   " +
    "  PP.COD_CLIENTE_PRE != $2 " +
    "AND  " +
    "  PP.STATUS = $6 " +
    "AND  " +
    "  pp.cod_indica_pre = $1 " +
    "AND  " +
    "  pp.cod_loja_pre = $7 " +
    "GROUP BY  " +
    "   pp.np,pp.data_pre,pp.situacao,pp.cod_cliente_pre,pp.tabela,c.cliente,v.vendedor, l.loja, d.plano, ind.perc_rep " +
    "ORDER BY  " +
    "  PP.np";
  try {
    const rsPreVendas = await pg.execute(sqlListaPreVendas, [
      indicador,
      vazio,
      planoNaoEntra,
      mes,
      ano,
      finalizado,
      loja
    ]);
    let linhas = rsPreVendas.rows.length;
    //----------- varivais calculas -------
    let total_vlr_base_pp_lista = [];
    for (let i = 0; i < linhas; i++) {
      total_vlr_base_pp_lista[i] = rsPreVendas.rows[i].total_vlr_tabela;
    }
    //----------- varivais calculas -------
    const response = {
      quantidade: rsPreVendas.rows.length,
      prevendas: rsPreVendas.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.listaPreVendasDoCliente = async (req, res) => {
  let mes = req.params.mes;
  let ano = req.params.ano;
  let loja = req.params.loja;
  let idCliente = req.params.idCliente;
  // idCliente = '00000165'

  let vazio = "";
  let planoNaoEntra = "061";
  let finalizado = "Finalizado";

  console.log("************** LISTA PRE-VENDAS ****************");
  console.log("mes(listaPreVendas): " + mes);
  console.log("ano(listaPreVendas): " + ano);
  console.log("loja(listaPreVendas): " + loja);


  

  let sqlListaPreVendas =
    "SELECT " +
    "   DISTINCT(PP.NP) AS NP, " +
    "   ROW_NUMBER() OVER () AS key , " +
    "   TO_CHAR(PP.DATA_PRE, 'DD/MM/YYYY') as data_pre, " +
    "   PP.tabela, " +
    "   round(SUM(pp.comissao) , 2) AS comissao, " +
    "   round(SUM(pp.perc_ap) , 2) AS perc_ap, " +
    "   round(SUM(pp.vlr_total) , 2) as ptotal, " +
    "   round(SUM(pp.vlr_tabela), 2) as total_vlr_tabela, " +
    "   round(((SUM(pp.vlr_lucro_bruto)/ SUM(pp.vlr_total))) * 100, 2) as total_lb_percentual, " +
    "   round((SUM(pp.vlr_fator_financeiro)/ SUM(pp.vlr_total)) * 100 , 2) as vlr_fator_financeiro, " +
    "   round(((SUM(pp.vlr_lucro_bruto) + SUM(pp.vlr_fator_financeiro))/ SUM(pp.vlr_total)) * 100 , 2) as vlr_lb_fator_financeiro, " +
    "   round(((SUM(pp.vlr_tabela) - SUM(pp.vlr_total))/ SUM(pp.vlr_tabela)) * 100 , 2) as vlr_diff_tab, " +
    "   round(SUM(pp.vlr_total -  pp.vlr_fator_financeiro ), 2) as total_vlr_base_pp_lista, " +
    "   C.CLIENTE AS nome_cliente, " +
    "   v.vendedor, " +
    "   l.loja, " +
    "   d.plano " +
    "FROM  " +
    "FPREVENDAS PP  " +
    "   JOIN " +
    "     dclientes c on " +
    "       c.codcliente = pp.COD_CLIENTE_PRE " +
    "   JOIN " +
    "     dvendedores v ON " +
    "       v.codvendedor = pp.cod_vendedor_pre " +
    "   JOIN " +
    "     dlojas l ON " +
    "       pp.cod_loja_pre  = CAST(l.codloja  as INTEGER) " +
    "   JOIN " +
    "     dplanos d ON " +
    "       pp.plano_pre = d.cod_plano " +
    "WHERE " +
    "  PP.PLANO_PRE != $3 " +
    "AND   " +
    "  PP.COD_CLIENTE_PRE != $2 " +
    "AND  " +
    "  PP.STATUS = $4 " +
    "AND  " +
    "  pp.COD_CLIENTE_PRE = $1 " +
    "GROUP BY  " +
    "   pp.np,pp.data_pre,pp.situacao,pp.cod_cliente_pre,pp.tabela,c.cliente,v.vendedor, l.loja, d.plano " +
    "ORDER BY  " +
    "  PP.np";
    console.log(sqlListaPreVendas)
  try {
    const rsPreVendas = await pg.execute(sqlListaPreVendas, [
      idCliente,
      vazio,
      planoNaoEntra,
      finalizado
    ]);
    let linhas = rsPreVendas.rows.length;
    //----------- varivais calculas -------
    let total_vlr_base_pp_lista = [];
    for (let i = 0; i < linhas; i++) {
      total_vlr_base_pp_lista[i] = rsPreVendas.rows[i].total_vlr_tabela;
    }
    //----------- varivais calculas -------
    const response = {
      quantidade: rsPreVendas.rows.length,
      prevendas: rsPreVendas.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

//------------ ATUAL CATEGORIA ------------
exports.listaProdutos = async (req, res) => {
  let prevenda = req.params.prevenda;
  const { descricao_categoria } = req.body;
  console.log("-------------- listaProdutos -------------------");
  console.log(prevenda);
  console.log("-------------- listaProdutos -------------------");
  let sqlProdutos =
    "SELECT " +
    "   pp.cod_produto_pre , " +
    "   d.produto , " +
    "   pp.tabela , " +
    "   pp.quant , " +
    "   pp.vlr_und , " +
    "   pp.vlr_custo , " +
    "   pp.vlr_importo , " +
    "   pp.vlr_tabela , " +
    "   pp.vlr_desp_adm , " +
    "   pp.vlr_fator_financeiro , " +
    "   pp.vlr_lucro , " +
    "   pp.vlr_lucro_bruto , " +
    "   pp.vlr_total " +
    "FROM " +
    "   fprevendas pp " +
    "     JOIN dprodutos d ON " +
    "       pp.cod_produto_pre = d.codproduto " +
    "WHERE  " +
    "CAST(pp.np as INTEGER) = $1 ";
  console.log(sqlProdutos);
  try {
    const rs = await pg.execute(sqlProdutos, [prevenda]);
    const response = {
      quantidade: rs.rows.length,
      produtos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

//------------ ATUAL CATEGORIA ------------
exports.atualizaTotalPreVendas = async (req, res) => {
  let periodo = req.params.periodo;
  let indicador = req.params.indicador;
  const { descricao_categoria } = req.body;
  console.log("-------------- atualizaTotalPreVendas -------------------");
  let sqlChecaDados =
    "SELECT " +
    " * " +
    "FROM " +
    "   fprevendas_totais ft " +
    "WHERE " +
    "   ft.periodo = $1 " +
    "AND " +
    "   ft.cod_indica_pre = $2";
  console.log(sqlChecaDados);
  try {
    const rsCount = await pg.execute(sqlChecaDados, [periodo, indicador]);
    let linhas = rsCount.rows.length;
    const response = {
      linhas,
    };
    res.status(200).send(response);
  } catch (error) {
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listaLojas = async (req, res) => {
  console.log("************ listaLojas(inicio)****************")
  const sqlLListaLojas =
    "SELECT " +
    "     l.id_loja_venda as id_loja, l.descricao_loja as descricao " +
    "FROM " +
    "     lojas l " +
    "ORDER BY l.descricao_loja";

    console.log(sqlLListaLojas)
    console.log('********************** sqlLListaLojas *********************')
  try {
    let rs = await pg_proj_jmonte.execute(sqlLListaLojas);
    const response = {
      lojas: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};




