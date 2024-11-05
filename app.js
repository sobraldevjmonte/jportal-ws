const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

const cron = require("node-cron");
const testeController = require("./controllers/entregas_contatos_controller");

// Defina a tarefa agendada para rodar às 14:30 todos os dias
cron.schedule("00 21 * * *", async () => {
  console.log("Agendador executando às 21:00 horas...");
  console.log("Agendador executando...");
  await testeController.buscarDadosEntregas();
});

const bodyParser = require("body-parser");
const rotaRT = require("./routes/rt_router");
const rotaEtapas = require("./routes/etapas_router");
const rotaUsuarios = require("./routes/usuarios_router");
const rotaAnaliseNp = require("./routes/analise_np_router");
const rotaProfissionais = require("./routes/profissonais_router");
const rotaProfissionaisPedidos = require("./routes/profissonais_pedidos_router");
const rotaEntregasContato = require("./routes/entregas_contatos_router");

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
app.use("/rt/v1", rotaEntregasContato);
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
