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
    'GROUP BY ' + 
    '   p.fator_financeiro, P.codproduto, P.PRODUTO, P.CODGRUPO,P.COMPRADOR, P.QUANTIDADE, P.VALOR_UND, P.VLR_VENDIDO, P.VLR_TABELA, P.DESCONTO, P.IMPOSTO, P.DESP_ADM, P.LUCRO, P.TAXAENTREGA'

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

  let idLoja = +req.params.idLoja;
  let data = "2024-03-01";
  let nulo = "";

  const sqlLListaNps =
    "select " +
    "   distinct (a.np) , " +
    "   TO_CHAR(a.data,'DD/MM/YYYY') AS data , " +
    "   a.chave , " +
    "   a.codvendedor , " +
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
    "     a.data >= $1 " +
    "and " +
    "     a.np != $2 " +
    "order by " +
    "     a.np";

  console.log(sqlLListaNps);
  try {
    let rs = await pg.execute(sqlLListaNps, [data, nulo]);
    let countNps = rs.rows.length;


    for(let i = 0; i < countNps; i++) {
      rs.rows[i].key = i + 1
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
