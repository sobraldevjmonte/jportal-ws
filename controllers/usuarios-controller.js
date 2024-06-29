const pg = require("../conexao_jm");
const moment = require("moment");

exports.login = async (req, res) => {
  console.log("------------- usuarios-login -------------------");
  let x = req.body;
  let usuario = x.usuario;
  let senha = x.senha;
  let ativo = "S";

  let sqlLogin =
    'SELECT u."idUsuario" as idusuario, ' +
    '   u."codigoVendedor" as codigousuario, ' +
    '   u."idLoja" , ' +
    '   u."idNivelUsuario" , ' +
    '   u."nomeUsuario" as nomeusuario, ' +
    "   l.fantasia as loja, " +
    '   nu."descricaoNivel" as nivelusuario, ' +
    '   l.icomp '  +
    "FROM " +
    "   usuarios u " +
    'LEFT JOIN lojas l  on l."idLoja"  = u."idLoja" ' +
    'LEFT JOIN "nivelUsuario" nu on u."idNivelUsuario" = nu."idNivelUsuario" ' +
    "WHERE " +
    "   u.login = $1 " +
    "AND " +
    "   u.senha = $2 " +
    "AND " +
    " u.ativo = $3";
  try {
    let rs = await pg.execute(sqlLogin, [usuario, senha, ativo]);
    let linhas = rs.rows.length;
    console.log(rs.rows[0]);
    if (linhas > 0) {
      const response = {
        mensagem: "Autenticado com sucesso",
        nomeusuario: rs.rows[0].nomeusuario,
        idusuario: rs.rows[0].idusuario,
        codigousuario: rs.rows[0].codigousuario,
        loja: rs.rows[0].loja,
        idLoja: rs.rows[0].idLoja,
        nivelusuario: rs.rows[0].nivelusuario,
        idNivelUsuario: rs.rows[0].idNivelUsuario
      };
      return res.status(200).send(response);
    } else {
      const response = {
        mensagem: "Falha na autenticação",
      };
      console.log(response);
      return res.status(401).send(response);
    }
  } catch (error) {
    return res.status(401).send({ mensagem: "Falha na requisição." });
  }
};
