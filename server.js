const express = require("express");
const routes = require("./src/router/router");
const sequelize = require("./src/config/config");
const clienteRoutes = require("./src/router/clienteRoutes");
const adminRoutes = require("./src/router/adminRoutes");
const contasRoutes = require("./src/router/contasRoutes");
const notificacoesRoutes = require("./src/router/notificacoesRoutes");
const transacoesRoutes = require("./src/router/transacoesRoutes");

const app = express();

app.use(express.json());

app.get("/okay", (req, res) => {
  return res.status(200).json({
    msg: "Server Okay!",
    alive: true,
  });
});

// Rotes:
app.use("/api", routes);
app.use("/cliente", clienteRoutes);
app.use("/admin", adminRoutes);
app.use("/contas", contasRoutes);
app.use("/notificacoes", notificacoesRoutes);
app.use("/transacoes", transacoesRoutes);

// Conecxão com o Banco de Dados
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão estabelecida com sucesso!");

    return sequelize.sync();
  })
  .then(() => {
    app.listen(3000, (req, res) => {
      console.log("Estamos rodando em http://localhost:3000/");
    });
  })

  .catch((error) => {
    console.error("Erro ao se conectar com o banco:", error);
  });
