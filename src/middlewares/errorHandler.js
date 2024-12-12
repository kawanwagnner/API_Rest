// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log do erro para o console (ou use um logger mais avançado)

  res.status(500).json({
    msg: "Ocorreu um erro no servidor",
    // Em produção, evite retornar detalhes do erro
    // Detalhes adicionais podem ser enviados apenas em ambientes de desenvolvimento
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};

module.exports = errorHandler;
