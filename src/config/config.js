const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("dasafio_api_rest", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
