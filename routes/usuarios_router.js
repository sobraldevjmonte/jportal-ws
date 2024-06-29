const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarios-controller");

router.post("/usuarios/login", UsuarioController.login);

module.exports = router;