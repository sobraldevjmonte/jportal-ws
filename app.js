const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

const bodyParser = require("body-parser");
const rotaRT = require("./routes/rt_router");
const rotaEtapas = require("./routes/etapas_router");
const rotaUsuarios = require("./routes/usuarios_router");
const rotaAnaliseNp = require("./routes/analise_np_router");
const rotaProfissionais = require("./routes/profissonais_router");
const rotaProfissionaisPedidos = require("./routes/profissonais_pedidos_router");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); //apenas dados simples
app.use(bodyParser.json()); //apenas formato json de entrada
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Header",
        "Origin",
        "X-Requrested-With",
        "Accept",
        "Content-Type",
        "Authorization"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).send({});
    }

    next();
});

app.use("/rt/v1", rotaRT);
app.use("/rt/v1", rotaEtapas);
app.use("/rt/v1", rotaUsuarios);
app.use("/rt/v1", rotaAnaliseNp);
app.use("/rt/v1", rotaProfissionais);
app.use("/rt/v1", rotaProfissionaisPedidos);
//----------- quando nao encontra a rota --------------
app.use((req, res, next) => {
    const erro = new Error("Rota não encontrada!");
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message,
        },
    });
});

module.exports = app;
