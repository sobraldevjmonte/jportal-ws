const { diffieHellman } = require("crypto");
const pg = require("../conexao_dwh");
const moment = require("moment");

exports.listarProdutosNp = async (req, res) => {
  let np = req.params.np;
  let espacos = " ";
  let semespacos = "";
  console.log(np);

  const sqlLListaProdutosNp =
    "SELECT " +
    "   p.codproduto , " +
    "   p.produto , " +
    "   p.codgrupo , " +
    "   p.comprador , " +
    "   ROUND((p.quantidade),2) AS quantidade, " +
    "   ROUND((p.valor_und),2) AS valor_und, " +
    "   ROUND((p.vlr_vendido),2) AS vlr_vendido, " +
    "   ROUND((p.vlr_tabela),2) AS vlr_tabela, " +
    "   ROUND((p.desconto),2) AS desconto, " +
    "   ROUND((p.imposto),2) AS imposto, " +
    "   ROUND((p.desp_adm),2) AS desp_adm , " +
    "   ROUND((p.fator_financeiro),2) as  fator_financeiro, " +
    "   ROUND((p.lucro),2) AS lucro , " +
    "   ROUND((p.taxaentrega),2) AS taxaentrega " +
    "FROM " +
    "	  vs_analise_np p " +
    "WHERE  " +
    "	  p.np = $1" +
    "GROUP BY " +
    "   p.fator_financeiro, P.codproduto, P.PRODUTO, P.CODGRUPO,P.COMPRADOR, P.QUANTIDADE, P.VALOR_UND, P.VLR_VENDIDO, P.VLR_TABELA, P.DESCONTO, P.IMPOSTO, P.DESP_ADM, P.LUCRO, P.TAXAENTREGA";

  console.log(sqlLListaProdutosNp);
  try {
    let rs = await pg.execute(sqlLListaProdutosNp, [np]);
    let countProdutosNp = rs.rows.length;

    let sqlTotaisDaNp =
      "SELECT " +
      "   'TOTAIS' AS  comprador, " +
      "   ROUND(SUM(P.QUANTIDADE),2) AS quantidade, " +
      "   ROUND(SUM(P.VALOR_UND),2) AS valor_und, " +
      "   ROUND(SUM(P.VLR_VENDIDO),2) AS vlr_vendido, " +
      "   ROUND(SUM(P.VLR_TABELA),2) AS vlr_tabela, " +
      "   ROUND(SUM(P.DESCONTO),2) AS desconto, " +
      "   ROUND(SUM(P.IMPOSTO),2) AS imposto, " +
      "   ROUND(SUM(P.DESP_ADM),2) AS desp_adm, " +
      "   ROUND((SUM(P.FATOR_FINANCEIRO)/SUM(P.VLR_VENDIDO)),2) AS fator_financeiro, " +
      "   ROUND(SUM(P.LUCRO),2) AS lucro, " +
      "   ROUND(SUM(P.TAXAENTREGA),2) AS taxaentrega " +
      "FROM " +
      "   VS_ANALISE_NP P " +
      "WHERE P.NP = $1";

    let rst = await pg.execute(sqlTotaisDaNp, [np]);
    rs.rows.push(rst.rows[0]);

    const response = {
      registros: countProdutosNp,
      //totais_np: rst.rows,
      lista_produtos_np: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
exports.listarNps = async (req, res) => {
  console.log("------------- listarNps(AnaliseNp) -------------------");

  let mes = +req.params.mes;
  let ano = +req.params.ano;

  let idLoja = +req.params.idLoja;

  let diaFim = "31";
  if (mes === 4 || mes === 6 || mes === 9 || mes === 11) {
    diaFim = "30";
  }
  if (mes === 2) {
    diaFim = "28";
  }
  // console.log(ano + ' ' + mes );

  // let data = "2024-03-01";
  let dataInicio = ano + "/" + mes + "/01";
  let dataFim = "";
  dataFim = ano + "/" + mes + "/" + diaFim;

  console.log(dataInicio);
  console.log(dataFim);
  console.log(idLoja)
  let nulo = "";

  const sqlLListaNps =
    "select " +
    "   distinct (a.np) , " +
    "   TO_CHAR(a.data,'DD/MM/YYYY') AS data_formatada , " +
    "   a.chave , " +
    "   a.data , " +
    "   a.codvendedor , " +
    "   a.codlojavendedor , " +
    "   a.vendedor , " +
    "   a.autorizacao , " +
    "   a.tipoentrega , " +
    "   a.codcliente , " +
    "   a.cliente , " +
    "   a.indicador , " +
    "   a.codformapgto , " +
    "   a.plano , " +
    "   a.tabela , " +
    "   a.promocao , " +
    "   a.f10, " +
    "   ap.obs " +
    "from  " +
    "     vs_analise_np a " +
    "     LEFT JOIN analise_np ap ON " +
    "         a.np = ap.np " +
    "where " +
    "     a.data between $1 and $2 " +
    "and " +
    "    COALESCE(NULLIF(a.np, ''), NULL) IS NOT NULL " +
    "and " +
    "    a.codlojavendedor = $3 " +
    "order by " +
    "     a.data";

  console.log(sqlLListaNps);
  try {
    let rs = await pg.execute(sqlLListaNps, [dataInicio, dataFim, idLoja]);
    let countNps = rs.rows.length;

    for (let i = 0; i < countNps; i++) {
      rs.rows[i].key = i + 1;
    }

    const response = {
      registros: countNps,
      lista_nps: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};
