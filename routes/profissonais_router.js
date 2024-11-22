const express = require("express");
const router = express.Router();

const uploadImagens = require("../middlewares/upload_imagens_brindes");
const ProfissionaisController = require("../controllers/profissionais_controller");



router.get("/profissionais/listar-pedidos/:mes/:ano/:loja", ProfissionaisController.listarPedidos);
router.get("/profissionais/imprimir-pedidos/:mes/:ano/:loja", ProfissionaisController.imprimirPedidos);
router.get("/profissionais/imprimir-todos-pedidos", ProfissionaisController.imprimirPedidosTodos);
router.get("/profissionais/listar-usuarios", ProfissionaisController.listarUsuarios);
router.put("/profissionais/ativar-usuario/:id", ProfissionaisController.ativarUsuario);
router.delete("/profissionais/excluir-usuario/:id", ProfissionaisController.excluirUsuario);
router.put("/profissionais/inativar-usuario/:id", ProfissionaisController.inativarUsuario);
router.put("/profissionais/aprovar-np/:id_vendas/:id_usuario/:pontos_venda", ProfissionaisController.aprovarNp);
router.put("/profissionais/rejeitar-np", ProfissionaisController.rejeitarNp);

router.put("/profissionais/salvar-np/:id_np", ProfissionaisController.salvarNp);
router.get("/profissionais/buscar-np/:numero_np", ProfissionaisController.buscaNp);

//********************* PREMIOS CADASTRO *************************/
router.get("/profissionais/premios-listar", ProfissionaisController.premiosListar);

// router.post('/profissionais/anexar-arquivo', uploadImagens.single('imagembrinde'), ProfissionaisController.nada);

// router.post('/profissionais/anexar-arquivo', uploadImagens.single('imagembrinde'), (req, res) => {
//   console.log('Arquivo recebido:', req.file);
//   ProfissionaisController.nada(req, res);
// });

  
router.post('/profissionais/anexar-arquivo', uploadImagens.single('imagembrinde'), (req, res) => {
    console.log(req.body)
    // console.log(typeof req.body);
    res.status(200).send({ message: 'Arquivo carregado com sucesso!', file: req.file });
    // if (!req.file) {
    //     return res.status(400).send({ msg: 'Nenhum arquivo enviado.' });
    // }
  });
  
router.post("/profissionais/salvar-brinde",ProfissionaisController.salvarBrinde);
router.delete("/profissionais/excluir-brinde/:id_brinde",ProfissionaisController.excluirBrinde);
router.put("/profissionais/inativar-brinde/:id_brinde",ProfissionaisController.inativarBrinde);
// router.post("/profissionais/salvar-brinde",ProfissionaisController.salvarImagem);
router.put("/profissionais/atualizar-brinde",ProfissionaisController.atualizarImagem);


module.exports = router;
