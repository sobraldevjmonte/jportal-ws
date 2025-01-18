// const pg = require("../conexao_jmonte_prod");
const pg = require("../conexao_jm");
const moment = require("moment");

exports.listarVendasPorLojaAnoAnterior = async (req, res) => {
  let grupo = req.params.grupo;
  let loja = req.params.loja;
  let mes = req.params.mes;
  console.log(grupo, loja, mes);
  let params = [grupo, loja, mes];
  console.log(
    "------------- listar istaVendasGruposLojasAnoAnterior -------------------"
  );
  let sqlLListaVendasGruposLojasAnoAnterior =
    "WITH DistinctNPs AS (" +
    "    SELECT DISTINCT " +
    "        vv.np, " +
    "        v.grupo, " +
    "        v.subgrupo, " +
    "        vv.codgrupo, " +
    "        vv.vlr_tabela, " +
    "        vv.vnd_bruta, " +
    "        vv.lucrobruto, " +
    "        vv.data, " +
    "        COALESCE(SUM(ft.vlr_frete), 0) AS total_vlr_frete " +
    "    FROM " +
    "        vs_pwb_dgrupos v " +
    "    LEFT JOIN " +
    "        vs_pwb_fvendas_grupos vv " +
    "        ON v.codgrupo = vv.codgrupo " +
    "    LEFT JOIN " +
    "        vs_pwb_ftaxa_entrega ft " +
    "        ON vv.chave = ft.chave " +
    "    WHERE " +
    "        v.grupo = $1 " +
    "        AND vv.codloja = $2 " +
    "        AND vv.data >= TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) - 1 || '-' || $3 || '-01', 'YYYY-MM-DD') " +
    "        AND vv.data < TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) - 1 || '-' || ($3::int + 1) || '-01', 'YYYY-MM-DD') " +
    "    GROUP BY " +
    "        vv.np, v.grupo, v.subgrupo, vv.codgrupo, vv.vlr_tabela, vv.vnd_bruta, vv.lucrobruto, vv.data " +
    ") " +
    "SELECT " +
    "    grupo, " +
    "    subgrupo, " +
    "    codgrupo, " +
    "    COUNT(DISTINCT np) AS total_nps, " +
    "    SUM(vlr_tabela) AS total_vlr_tabela, " +
    "    SUM(vnd_bruta) AS total_vnd_bruta, " +
    "    SUM(ROUND(lucrobruto, 2)) AS total_lucrobruto, " +
    "    SUM(total_vlr_frete) AS total_vlr_frete " +
    "FROM " +
    "    DistinctNPs " +
    "GROUP BY " +
    "    grupo, subgrupo, codgrupo " +
    "ORDER BY " +
    "    grupo, subgrupo";

  console.log(sqlLListaVendasGruposLojasAnoAnterior);

  try {
    let rs = await pg.execute(sqlLListaVendasGruposLojasAnoAnterior, params);
    let countVendasGrupos = rs.rows.length;

    const response = {
      quantidade: countVendasGrupos,
      vendassubgrupos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};
exports.listarVendasPorLoja = async (req, res) => {
  let grupo = req.params.grupo;
  let loja = req.params.loja;
  let mes = req.params.mes;
  console.log(grupo, loja, mes);
  let params = [grupo, loja, mes];
  console.log("------------- listar istaVendasGruposLojas -------------------");
  let sqlLListaVendasGruposLojas =
    "WITH DistinctNPs AS (" +
    "    SELECT DISTINCT " +
    "        vv.np, " +
    "        v.grupo, " +
    "        v.subgrupo, " +
    "        vv.codgrupo, " +
    "        vv.vlr_tabela, " +
    "        vv.vnd_bruta, " +
    "        vv.lucrobruto, " +
    "        vv.data, " +
    "        COALESCE(SUM(ft.vlr_frete), 0) AS total_vlr_frete " +
    "    FROM " +
    "        vs_pwb_dgrupos v " +
    "    LEFT JOIN " +
    "        vs_pwb_fvendas_grupos vv " +
    "        ON v.codgrupo = vv.codgrupo " +
    "    LEFT JOIN " +
    "        vs_pwb_ftaxa_entrega ft " +
    "        ON vv.chave = ft.chave " +
    "    WHERE " +
    "        v.grupo = $1 " +
    "        AND vv.codloja = $2 " +
    "        AND vv.data >= TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || $3 || '-01', 'YYYY-MM-DD') " +
    "        AND vv.data < TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || ($3::int + 1) || '-01', 'YYYY-MM-DD') " +
    "    GROUP BY " +
    "        vv.np, v.grupo, v.subgrupo, vv.codgrupo, vv.vlr_tabela, vv.vnd_bruta, vv.lucrobruto, vv.data " +
    ") " +
    "SELECT " +
    "    grupo, " +
    "    subgrupo, " +
    "    codgrupo, " +
    "    COUNT(DISTINCT np) AS total_nps, " +
    "    SUM(vlr_tabela) AS total_vlr_tabela, " +
    "    SUM(vnd_bruta) AS total_vnd_bruta, " +
    "    SUM(ROUND(lucrobruto, 2)) AS total_lucrobruto, " +
    "    SUM(total_vlr_frete) AS total_vlr_frete " +
    "FROM " +
    "    DistinctNPs " +
    "GROUP BY " +
    "    grupo, subgrupo, codgrupo " +
    "ORDER BY " +
    "    grupo, subgrupo";

  console.log(sqlLListaVendasGruposLojas);

  try {
    let rs = await pg.execute(sqlLListaVendasGruposLojas, params);
    let countVendasGrupos = rs.rows.length;

    const response = {
      quantidade: countVendasGrupos,
      vendassubgrupos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return;
  }
};
exports.listarCodigosDosGrupos = async (req, res) => {
  let grupo = req.params.grupo;
  console.log(grupo);
  console.log("------------- llistarCodigosDosGrupos -------------------");
  let sqlLListaSubGrupos =
    "select " +
    " distinct(vpd.codgrupo), subgrupo  " +
    "from " +
    "   vs_pwb_dgrupos vpd " +
    "WHERE " +
    "   vpd.grupo = $1";
  console.log(sqlLListaSubGrupos);

  try {
    let rs = await pg.execute(sqlLListaSubGrupos, [grupo]);
    let countCodigosGrupos = rs.rows.length;

    console.log(rs);

    const response = {
      quantidade: countCodigosGrupos,
      subgrupos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: error, mensagem: "Erro ao procurar" });
  }
};

exports.listarGrupos = async (req, res) => {
  let loja = req.params.loja;
  let mes = parseInt(req.params.mes); // Pegando o mês como parâmetro
  let ano = new Date().getFullYear(); // Ano atual

  // Ajustar ano se o mês for janeiro
  if (mes === 1) {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    mes = 12;
    ano -= 1;
  } else {
    console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyy')
    mes -= 1; // Mês anterior
  }

  mes = 11;
  ano = 2024

  let params = [loja, mes, ano];
  console.log("------------- listarGrupos -------------------");
  console.log(loja, mes, ano);

  let sqlLListaGrupos = `
    SELECT 
        DISTINCT v.grupo, 
        COUNT(DISTINCT vv.np) AS total_nps, 
        SUM(vv.vnd_bruta) AS total_vnd_bruta, 
        SUM(ROUND(vv.lucrobruto, 2)) AS total_lucrobruto, 
        SUM(vv.vlr_tabela) AS total_vlr_tabela, 
        COALESCE(SUM(ft.vlr_frete), 0) AS total_vlr_frete
    FROM 
        vs_pwb_dgrupos v
    LEFT JOIN 
        vs_pwb_fvendas_grupos vv 
        ON v.codgrupo = vv.codgrupo
    LEFT JOIN 
        vs_pwb_ftaxa_entrega ft 
        ON vv.chave = ft.chave
    WHERE 
        vv.codloja = $1
        AND vv.data >= TO_DATE($3 || '-' || $2 || '-01', 'YYYY-MM-DD')
        AND vv.data <= TO_DATE($3 || '-' || $2 || '-01', 'YYYY-MM-DD') + INTERVAL '1 month' - INTERVAL '1 day'
    GROUP BY 
        v.grupo 
    ORDER BY 
        v.grupo
  `;

  console.log(sqlLListaGrupos);

  try {
    // Execute the first query
    let rs = await pg.execute(sqlLListaGrupos, params);
    let countGrupos = rs.rows.length;

    // Adiciona a segunda consulta dentro do loop
    for (let i = 0; i < countGrupos; i++) {
      let grupo = rs.rows[i].grupo;

      // Segunda consulta para calcular o valor das devoluções para cada grupo
      let sqlDevolucoes = `
        WITH DevolucoesAgregadas AS (
            SELECT codgrupo, 
                   SUM(vlr_devolucao) AS soma_devolucoes
            FROM vs_pwb_fdevolucoes
            WHERE "data" >= TO_DATE($3 || '-' || $2 || '-01', 'YYYY-MM-DD')
              AND "data" < TO_DATE($3 || '-' || $2 || '-01', 'YYYY-MM-DD') + INTERVAL '1 month'
              AND codloja = $1
            GROUP BY codgrupo
        )
        SELECT SUM(da.soma_devolucoes) AS total_devolucoes
        FROM vs_pwb_dgrupos v
        LEFT JOIN DevolucoesAgregadas da 
            ON v.codgrupo = da.codgrupo
        WHERE v.grupo = $4;
      `;

      // Execute the second query for each group
      let devolucoesResult = await pg.execute(sqlDevolucoes, [
        params[0],
        params[1],
        params[2],
        grupo,
      ]);

      // Access the total_devolucoes value from the second query
      let totalDevolucoes =
        devolucoesResult.rows.length > 0
          ? devolucoesResult.rows[0].total_devolucoes
          : 0;

      // Include the total_devolucoes value into the result of the first query row
      rs.rows[i].total_vlr_devolucoes = totalDevolucoes;
    }

    // Enviar a resposta final
    const response = {
      quantidade: countGrupos,
      grupos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error.code);
    return res
      .status(404)
      .send({ error: error.code, mensagem: "Erro ao procurar" + error.code });
  }
};


// exports.listarGrupos = async (req, res) => {
//   let loja = req.params.loja;
//   let mes = req.params.mes;
//   mes = 11;
//   let params = [loja, mes];
//   console.log("------------- listarGrupos -------------------");
//   console.log(loja, mes);

//   let sqlLListaGrupos = `
//     SELECT 
//         DISTINCT v.grupo, 
//         COUNT(DISTINCT vv.np) AS total_nps, 
//         SUM(vv.vnd_bruta) AS total_vnd_bruta, 
//         SUM(ROUND(vv.lucrobruto, 2)) AS total_lucrobruto, 
//         SUM(vv.vlr_tabela) AS total_vlr_tabela, 
//         COALESCE(SUM(ft.vlr_frete), 0) AS total_vlr_frete
//     FROM 
//         vs_pwb_dgrupos v
//     LEFT JOIN 
//         vs_pwb_fvendas_grupos vv 
//         ON v.codgrupo = vv.codgrupo
//     LEFT JOIN 
//         vs_pwb_ftaxa_entrega ft 
//         ON vv.chave = ft.chave
//     WHERE 
//         vv.codloja = $1
//         AND vv.data >= TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || $2::int || '-01', 'YYYY-MM-DD')
//         AND vv.data <= TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || $2::int || '-01', 'YYYY-MM-DD') + INTERVAL '1 month' - INTERVAL '1 day'
//     GROUP BY 
//         v.grupo 
//     ORDER BY 
//         v.grupo
//   `;

//   console.log(sqlLListaGrupos);

//   try {
//     // Execute the first query
//     let rs = await pg.execute(sqlLListaGrupos, params);
//     let countGrupos = rs.rows.length;

//     // Adiciona a segunda consulta dentro do loop
//     for (let i = 0; i < countGrupos; i++) {
//       let grupo = rs.rows[i].grupo;

//       // Segunda consulta para calcular o valor das devoluções para cada grupo
//       let sqlDevolucoes = `
//         WITH DevolucoesAgregadas AS (
//             SELECT codgrupo, 
//                    SUM(vlr_devolucao) AS soma_devolucoes
//             FROM vs_pwb_fdevolucoes
//             WHERE "data" >= TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || $2::int || '-01', 'YYYY-MM-DD')
//               AND "data" < TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || $2::int || '-01', 'YYYY-MM-DD') + INTERVAL '1 month'
//               AND codloja = $1
//             GROUP BY codgrupo
//         )
//         SELECT SUM(da.soma_devolucoes) AS total_devolucoes
//         FROM vs_pwb_dgrupos v
//         LEFT JOIN DevolucoesAgregadas da 
//             ON v.codgrupo = da.codgrupo
//         WHERE v.grupo = $3;
//       `;

//       // Execute the second query for each group
//       let devolucoesResult = await pg.execute(sqlDevolucoes, [
//         params[0],
//         params[1],
//         grupo,
//       ]);

//       // Access the total_devolucoes value from the second query
//       let totalDevolucoes =
//         devolucoesResult.rows.length > 0
//           ? devolucoesResult.rows[0].total_devolucoes
//           : 0;

//       // Include the total_devolucoes value into the result of the first query row
//       rs.rows[i].total_vlr_devolucoes = totalDevolucoes;
//     }

//     // Enviar a resposta final
//     const response = {
//       quantidade: countGrupos,
//       grupos: rs.rows,
//     };
//     res.status(200).send(response);
//   } catch (error) {
//     console.log(error.code);
//     return res
//       .status(404)
//       .send({ error: error.code, mensagem: "Erro ao procurar" + error.code });
//   }
// };


exports.listarGruposAnoAnterior = async (req, res) => {
  let loja = req.params.loja;
  let mes = req.params.mes;
  console.log(loja, mes);
  let params = [loja, mes];
  console.log("------------- listarGruposAnoAnterior -------------------");

  let sqlLListaGruposAnoAnterior = `
  SELECT 
      DISTINCT v.grupo, 
      COUNT(DISTINCT vv.np) AS total_nps, 
      SUM(vv.vnd_bruta) AS total_vnd_bruta, 
      SUM(ROUND(vv.lucrobruto, 2)) AS total_lucrobruto, 
      SUM(vv.vlr_tabela) AS total_vlr_tabela, 
      COALESCE(SUM(ft.vlr_frete), 0) AS total_vlr_frete
  FROM 
      vs_pwb_dgrupos v
  LEFT JOIN 
      vs_pwb_fvendas_grupos vv 
      ON v.codgrupo = vv.codgrupo
  LEFT JOIN 
      vs_pwb_ftaxa_entrega ft 
      ON vv.chave = ft.chave
  WHERE 
      vv.codloja = $1
      AND vv.data >= TO_DATE((EXTRACT(YEAR FROM CURRENT_DATE) - 1) || '-' || $2::int || '-01', 'YYYY-MM-DD')
      AND vv.data <= TO_DATE((EXTRACT(YEAR FROM CURRENT_DATE) - 1) || '-' || $2::int || '-01', 'YYYY-MM-DD') + INTERVAL '1 month' - INTERVAL '1 day'
  GROUP BY 
      v.grupo 
  ORDER BY 
      v.grupo`;

  try {
    // Execute the first query
    let rs = await pg.execute(sqlLListaGruposAnoAnterior, params);
    let countGrupos = rs.rows.length;

    // Adiciona a segunda consulta dentro do loop
    for (let i = 0; i < countGrupos; i++) {
      let grupo = rs.rows[i].grupo;

      // Segunda consulta para calcular o valor das devoluções para cada grupo
      let sqlDevolucoes = `
            WITH DevolucoesAgregadas AS (
                SELECT codgrupo, 
                       SUM(vlr_devolucao) AS soma_devolucoes
                FROM vs_pwb_fdevolucoes
                WHERE "data" >= TO_DATE((EXTRACT(YEAR FROM CURRENT_DATE) - 1) || '-' || $2::int || '-01', 'YYYY-MM-DD')
                  AND "data" < TO_DATE((EXTRACT(YEAR FROM CURRENT_DATE) - 1) || '-' || $2::int || '-01', 'YYYY-MM-DD') + INTERVAL '1 month'
                  AND codloja = $1
                GROUP BY codgrupo
            )
            SELECT SUM(da.soma_devolucoes) AS total_devolucoes
            FROM vs_pwb_dgrupos v
            LEFT JOIN DevolucoesAgregadas da 
                ON v.codgrupo = da.codgrupo
            WHERE v.grupo = $3;
          `;

      // Execute the second query for each group
      let devolucoesResult = await pg.execute(sqlDevolucoes, [
        params[0],
        params[1],
        grupo,
      ]);

      // Access the total_devolucoes value from the second query
      let totalDevolucoes =
        devolucoesResult.rows.length > 0
          ? devolucoesResult.rows[0].total_devolucoes
          : 0;

      // Include the total_devolucoes value into the result of the first query row
      rs.rows[i].total_vlr_devolucoes = totalDevolucoes;
    }

    // Enviar a resposta final
    const response = {
      quantidade: countGrupos,
      grupos: rs.rows,
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error.code);
    return res
      .status(404)
      .send({ error: error.code, mensagem: "Erro ao procurar" + error.code });
  }
};
