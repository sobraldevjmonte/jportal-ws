const multer = require('multer');
const path = require('path');


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