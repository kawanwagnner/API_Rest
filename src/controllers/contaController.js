// controllers/contaController.js

const Conta = require("../models/Contas");
const { Op } = require("sequelize");

const contaController = {
  // Método para criar uma nova conta
  create: async (req, res) => {
    const { numero, tipo, saldo, clienteId } = req.body; // Ajuste os campos conforme seu modelo

    try {
      // Verifica se o número da conta já está em uso
      const existingConta = await Conta.findOne({ where: { numero } });
      if (existingConta) {
        return res.status(400).json({
          msg: "Número da conta já está em uso",
        });
      }

      // Cria a conta
      const conta = await Conta.create({
        numero,
        tipo,
        saldo,
        clienteId, // Supondo que há uma relação com o Cliente
      });

      return res.status(201).json({
        msg: "Conta criada com sucesso",
        conta: {
          id: conta.id,
          numero: conta.numero,
          tipo: conta.tipo,
          saldo: conta.saldo,
          clienteId: conta.clienteId,
          // Não retorne campos sensíveis, se houver
        },
      });
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      return res.status(500).json({
        msg: "Erro ao tentar criar a conta",
      });
    }
  },

  // Método para atualizar uma conta existente
  update: async (req, res) => {
    const { id } = req.params;
    const { numero, tipo, saldo, clienteId } = req.body; // Ajuste os campos conforme seu modelo

    try {
      const conta = await Conta.findByPk(id);
      if (!conta) {
        return res.status(404).json({
          msg: "Conta não encontrada",
        });
      }

      // Verifica se o número da conta está sendo atualizado e se já está em uso
      if (numero && numero !== conta.numero) {
        const numeroExists = await Conta.findOne({ where: { numero } });
        if (numeroExists) {
          return res.status(400).json({
            msg: "Número da conta já está em uso por outra conta",
          });
        }
        conta.numero = numero;
      }

      // Atualiza os demais campos, se fornecidos
      if (tipo) conta.tipo = tipo;
      if (saldo !== undefined) conta.saldo = saldo; // Permitir saldo 0
      if (clienteId) conta.clienteId = clienteId;

      await conta.save();

      return res.status(200).json({
        msg: "Conta atualizada com sucesso!",
        conta: {
          id: conta.id,
          numero: conta.numero,
          tipo: conta.tipo,
          saldo: conta.saldo,
          clienteId: conta.clienteId,
          // Não retorne campos sensíveis, se houver
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar conta:", error);
      return res.status(500).json({
        msg: "Erro ao tentar atualizar a conta",
      });
    }
  },

  // Método para obter todas as contas
  getAll: async (req, res) => {
    try {
      const contas = await Conta.findAll({
        // Exclua campos sensíveis, se houver
        attributes: { exclude: ["senha"] }, // Exemplo, ajuste conforme necessário
        include: [
          { association: "Cliente", attributes: ["id", "nome", "email"] },
        ], // Se houver relações
      });

      if (contas.length === 0) {
        return res.status(404).json({
          msg: "Nenhuma conta encontrada",
        });
      }

      return res.status(200).json({
        msg: "Todas as contas",
        contas,
      });
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },

  // Método para obter uma conta específica por ID
  getOne: async (req, res) => {
    const { id } = req.params;

    try {
      const conta = await Conta.findByPk(id, {
        // Exclua campos sensíveis, se houver
        attributes: { exclude: ["senha"] }, // Exemplo, ajuste conforme necessário
        include: [
          { association: "Cliente", attributes: ["id", "nome", "email"] },
        ], // Se houver relações
      });

      if (!conta) {
        return res.status(404).json({
          msg: "Conta não encontrada",
        });
      }

      return res.status(200).json({
        msg: "Conta encontrada",
        conta,
      });
    } catch (error) {
      console.error("Erro ao buscar conta:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },

  // Método para deletar uma conta específica por ID
  delete: async (req, res) => {
    const { id } = req.params;

    try {
      const conta = await Conta.findByPk(id);

      if (!conta) {
        return res.status(404).json({
          msg: "Conta não encontrada",
        });
      }

      await conta.destroy();

      return res.status(200).json({
        msg: "Conta deletada com sucesso!",
        conta: {
          id: conta.id,
          numero: conta.numero,
          tipo: conta.tipo,
          saldo: conta.saldo,
          clienteId: conta.clienteId,
          // Não retorne campos sensíveis, se houver
        },
      });
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },
};

module.exports = contaController;
