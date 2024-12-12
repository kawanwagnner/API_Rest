// controllers/transacoesController.js

const Transacao = require("../models/Transacoes"); // Ajuste o caminho conforme sua estrutura
const { Op } = require("sequelize"); // Para consultas avançadas, se necessário

const transacoesController = {
  // Método para criar uma nova transação
  create: async (req, res) => {
    const { tipo, valor, contaOrigemId, contaDestinoId, descricao } = req.body; // Ajuste os campos conforme seu modelo

    try {
      // Opcional: Verificar se as contas de origem e destino existem
      const contaOrigem = await Transacao.findByPk(contaOrigemId);
      const contaDestino = await Transacao.findByPk(contaDestinoId);

      if (!contaOrigem || !contaDestino) {
        return res
          .status(400)
          .json({ msg: "Conta de origem ou destino não encontrada" });
      }

      // Cria a transação
      const transacao = await Transacao.create({
        tipo,
        valor,
        contaOrigemId,
        contaDestinoId,
        descricao,
      });

      return res.status(201).json({
        msg: "Transação criada com sucesso",
        transacao: {
          id: transacao.id,
          tipo: transacao.tipo,
          valor: transacao.valor,
          contaOrigemId: transacao.contaOrigemId,
          contaDestinoId: transacao.contaDestinoId,
          descricao: transacao.descricao,
          // Não retorne campos sensíveis, se houver
        },
      });
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      return res.status(500).json({
        msg: "Erro ao tentar criar a transação",
      });
    }
  },

  // Método para atualizar uma transação existente
  update: async (req, res) => {
    const { id } = req.params;
    const { tipo, valor, contaOrigemId, contaDestinoId, descricao } = req.body; // Ajuste os campos conforme seu modelo

    try {
      const transacao = await Transacao.findByPk(id);
      if (!transacao) {
        return res.status(404).json({
          msg: "Transação não encontrada",
        });
      }

      // Atualiza os campos fornecidos
      if (tipo) transacao.tipo = tipo;
      if (valor !== undefined) transacao.valor = valor; // Permitir valor 0
      if (contaOrigemId) {
        const contaOrigem = await Transacao.findByPk(contaOrigemId);
        if (!contaOrigem) {
          return res
            .status(400)
            .json({ msg: "Conta de origem não encontrada" });
        }
        transacao.contaOrigemId = contaOrigemId;
      }
      if (contaDestinoId) {
        const contaDestino = await Transacao.findByPk(contaDestinoId);
        if (!contaDestino) {
          return res
            .status(400)
            .json({ msg: "Conta de destino não encontrada" });
        }
        transacao.contaDestinoId = contaDestinoId;
      }
      if (descricao) transacao.descricao = descricao;

      await transacao.save();

      return res.status(200).json({
        msg: "Transação atualizada com sucesso!",
        transacao: {
          id: transacao.id,
          tipo: transacao.tipo,
          valor: transacao.valor,
          contaOrigemId: transacao.contaOrigemId,
          contaDestinoId: transacao.contaDestinoId,
          descricao: transacao.descricao,
          // Não retorne campos sensíveis, se houver
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      return res.status(500).json({
        msg: "Erro ao tentar atualizar a transação",
      });
    }
  },

  // Método para obter todas as transações
  getAll: async (req, res) => {
    try {
      const transacoes = await Transacao.findAll({
        // Exclua campos sensíveis, se houver
        attributes: { exclude: ["senha"] }, // Ajuste conforme necessário
        include: [
          {
            association: "ContaOrigem", // Ajuste conforme o nome da associação
            attributes: ["id", "numero", "tipo"], // Campos a serem incluídos
          },
          {
            association: "ContaDestino", // Ajuste conforme o nome da associação
            attributes: ["id", "numero", "tipo"], // Campos a serem incluídos
          },
        ],
      });

      if (transacoes.length === 0) {
        return res.status(404).json({
          msg: "Nenhuma transação encontrada",
        });
      }

      return res.status(200).json({
        msg: "Todas as transações",
        transacoes,
      });
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },

  // Método para obter uma transação específica por ID
  getOne: async (req, res) => {
    const { id } = req.params;

    try {
      const transacao = await Transacao.findByPk(id, {
        // Exclua campos sensíveis, se houver
        attributes: { exclude: ["senha"] }, // Ajuste conforme necessário
        include: [
          {
            association: "ContaOrigem", // Ajuste conforme o nome da associação
            attributes: ["id", "numero", "tipo"], // Campos a serem incluídos
          },
          {
            association: "ContaDestino", // Ajuste conforme o nome da associação
            attributes: ["id", "numero", "tipo"], // Campos a serem incluídos
          },
        ],
      });

      if (!transacao) {
        return res.status(404).json({
          msg: "Transação não encontrada",
        });
      }

      return res.status(200).json({
        msg: "Transação encontrada",
        transacao,
      });
    } catch (error) {
      console.error("Erro ao buscar transação:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },

  // Método para deletar uma transação específica por ID
  delete: async (req, res) => {
    const { id } = req.params;

    try {
      const transacao = await Transacao.findByPk(id);

      if (!transacao) {
        return res.status(404).json({
          msg: "Transação não encontrada",
        });
      }

      await transacao.destroy();

      return res.status(200).json({
        msg: "Transação deletada com sucesso!",
        transacao: {
          id: transacao.id,
          tipo: transacao.tipo,
          valor: transacao.valor,
          contaOrigemId: transacao.contaOrigemId,
          contaDestinoId: transacao.contaDestinoId,
          descricao: transacao.descricao,
          // Não retorne campos sensíveis, se houver
        },
      });
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },
};

module.exports = transacoesController;
