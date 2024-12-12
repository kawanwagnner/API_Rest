// controllers/clienteController.js

const Cliente = require("../models/Clientes");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const clienteController = {
  // Método para criar um novo cliente
  create: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      // Verifica se o e-mail já está em uso
      const existingCliente = await Cliente.findOne({ where: { email } });
      if (existingCliente) {
        return res.status(400).json({
          msg: "E-mail já está em uso",
        });
      }

      // Cria uma hash para a senha, se aplicável
      const hashedSenha = await bcrypt.hash(senha, 10);

      const cliente = await Cliente.create({
        nome,
        email,
        senha: hashedSenha, // Armazena a senha criptografada
      });

      return res.status(201).json({
        msg: "Cliente criado com sucesso",
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          // Não retorne a senha
        },
      });
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      return res.status(500).json({
        msg: "Erro ao tentar criar o cliente",
      });
    }
  },

  // Método para atualizar um cliente existente
  update: async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body; // Ajuste os campos conforme seu modelo

    try {
      const cliente = await Cliente.findByPk(id);
      if (!cliente) {
        return res.status(404).json({
          msg: "Cliente não encontrado",
        });
      }

      // Verifica se o e-mail está sendo atualizado e se já está em uso
      if (email && email !== cliente.email) {
        const emailExists = await Cliente.findOne({ where: { email } });
        if (emailExists) {
          return res.status(400).json({
            msg: "E-mail já está em uso por outro cliente",
          });
        }
        cliente.email = email;
      }

      // Atualiza os demais campos, se fornecidos
      if (nome) cliente.nome = nome;
      if (senha) {
        const hashedSenha = await bcrypt.hash(senha, 10);
        cliente.senha = hashedSenha;
      }

      await cliente.save();

      return res.status(200).json({
        msg: "Cliente atualizado com sucesso!",
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          // Não retorne a senha
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      return res.status(500).json({
        msg: "Erro ao tentar atualizar o cliente",
      });
    }
  },

  // Método para obter todos os clientes
  getAll: async (req, res) => {
    try {
      const clientes = await Cliente.findAll({
        attributes: { exclude: ["senha"] }, // Exclui a senha da resposta
      });

      if (clientes.length === 0) {
        return res.status(404).json({
          msg: "Nenhum cliente encontrado",
        });
      }

      return res.status(200).json({
        msg: "Todos os clientes",
        clientes,
      });
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },

  // Método para obter um cliente específico por ID
  getOne: async (req, res) => {
    const { id } = req.params;

    try {
      const cliente = await Cliente.findByPk(id, {
        attributes: { exclude: ["senha"] }, // Exclui a senha da resposta
      });

      if (!cliente) {
        return res.status(404).json({
          msg: "Cliente não encontrado",
        });
      }

      return res.status(200).json({
        msg: "Cliente encontrado",
        cliente,
      });
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },

  // Método para deletar um cliente específico por ID
  delete: async (req, res) => {
    const { id } = req.params;

    try {
      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).json({
          msg: "Cliente não encontrado",
        });
      }

      await cliente.destroy();

      return res.status(200).json({
        msg: "Cliente deletado com sucesso!",
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          // Não retorne a senha
        },
      });
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },
};

module.exports = clienteController;
