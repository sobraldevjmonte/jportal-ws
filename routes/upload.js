const express = require("express");
const router = express.Router();

const UploadController = require("../controllers/upload-controller");

router.post('/upload/anexar-arquivo', uploadImagens.single('imagembrinde'), (req, res) => {
    console.log(req.body)
    // console.log(typeof req.body);
    // if (!req.file) {
    //     return res.status(400).send({ msg: 'Nenhum arquivo enviado.' });
    // }
    res.status(200).send({ message: 'Arquivo carregado com sucesso!', file: req.file });
  });
//---------- salvar anexos ---------
//---------- salvar imagem do produto ---------
// router.post("/profissionais/anexar-arquivo",uploadImagens.single("imagembrinde"),ProfissionaisController.nada);


module.exports = router;