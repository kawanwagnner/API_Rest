// controllers/notificacoesController.js

const Notificacao = require("../models/Notificacoes");
const { Op } = require("sequelize");

const notificacoesController = {
  // Método para criar uma nova notificação
  create: async (req, res) => {
    const { titulo, mensagem, tipo, usuarioId } = req.body; // Ajuste os campos conforme seu modelo

    try {
      // Opcional: Verificar se o usuário existe, se houver relação com outro modelo
      // const usuario = await Usuario.findByPk(usuarioId);
      // if (!usuario) {
      //   return res.status(400).json({ msg: "Usuário não encontrado" });
      // }

      // Cria a notificação
      const notificacao = await Notificacao.create({
        titulo,
        mensagem,
        tipo,
        usuarioId, // Supondo que há uma relação com o Usuário
      });

      return res.status(201).json({
        msg: "Notificação criada com sucesso",
        notificacao: {
          id: notificacao.id,
          titulo: notificacao.titulo,
          mensagem: notificacao.mensagem,
          tipo: notificacao.tipo,
          usuarioId: notificacao.usuarioId,
          // Não retorne campos sensíveis, se houver
        },
      });
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      return res.status(500).json({
        msg: "Erro ao tentar criar a notificação",
      });
    }
  },

  // Método para atualizar uma notificação existente
  update: async (req, res) => {
    const { id } = req.params;
    const { titulo, mensagem, tipo, usuarioId } = req.body; // Ajuste os campos conforme seu modelo

    try {
      const notificacao = await Notificacao.findByPk(id);
      if (!notificacao) {
        return res.status(404).json({
          msg: "Notificação não encontrada",
        });
      }

      // Atualiza os campos fornecidos
      if (titulo) notificacao.titulo = titulo;
      if (mensagem) notificacao.mensagem = mensagem;
      if (tipo) notificacao.tipo = tipo;
      if (usuarioId) {
        // Opcional: Verificar se o usuário existe antes de atualizar
        // const usuario = await Usuario.findByPk(usuarioId);
        // if (!usuario) {
        //   return res.status(400).json({ msg: "Usuário não encontrado" });
        // }
        notificacao.usuarioId = usuarioId;
      }

      await notificacao.save();

      return res.status(200).json({
        msg: "Notificação atualizada com sucesso!",
        notificacao: {
          id: notificacao.id,
          titulo: notificacao.titulo,
          mensagem: notificacao.mensagem,
          tipo: notificacao.tipo,
          usuarioId: notificacao.usuarioId,
          // Não retorne campos sensíveis, se houver
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar notificação:", error);
      return res.status(500).json({
        msg: "Erro ao tentar atualizar a notificação",
      });
    }
  },

  // Método para obter todas as notificações
  getAll: async (req, res) => {
    try {
      const notificacoes = await Notificacao.findAll({
        // Exclua campos sensíveis, se houver
        attributes: { exclude: ["senha"] }, // Ajuste conforme necessário
        include: [
          {
            association: "Usuario", // Ajuste conforme o nome da associação
            attributes: ["id", "nome", "email"], // Campos a serem incluídos
          },
        ],
      });

      if (notificacoes.length === 0) {
        return res.status(404).json({
          msg: "Nenhuma notificação encontrada",
        });
      }

      return res.status(200).json({
        msg: "Todas as notificações",
        notificacoes,
      });
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },

  // Método para obter uma notificação específica por ID
  getOne: async (req, res) => {
    const { id } = req.params;

    try {
      const notificacao = await Notificacao.findByPk(id, {
        // Exclua campos sensíveis, se houver
        attributes: { exclude: ["senha"] }, // Ajuste conforme necessário
        include: [
          {
            association: "Usuario", // Ajuste conforme o nome da associação
            attributes: ["id", "nome", "email"], // Campos a serem incluídos
          },
        ],
      });

      if (!notificacao) {
        return res.status(404).json({
          msg: "Notificação não encontrada",
        });
      }

      return res.status(200).json({
        msg: "Notificação encontrada",
        notificacao,
      });
    } catch (error) {
      console.error("Erro ao buscar notificação:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },

  // Método para deletar uma notificação específica por ID
  delete: async (req, res) => {
    const { id } = req.params;

    try {
      const notificacao = await Notificacao.findByPk(id);

      if (!notificacao) {
        return res.status(404).json({
          msg: "Notificação não encontrada",
        });
      }

      await notificacao.destroy();

      return res.status(200).json({
        msg: "Notificação deletada com sucesso!",
        notificacao: {
          id: notificacao.id,
          titulo: notificacao.titulo,
          mensagem: notificacao.mensagem,
          tipo: notificacao.tipo,
          usuarioId: notificacao.usuarioId,
          // Não retorne campos sensíveis, se houver
        },
      });
    } catch (error) {
      console.error("Erro ao deletar notificação:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },
};

module.exports = notificacoesController;
