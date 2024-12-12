const Administrador = require("../models/Administradores");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminController = {
  login: async (req, res) => {
    const { email, senha } = req.body;

    try {
      const adm = await Administrador.findOne({ where: { email } });

      if (!adm) {
        return res.status(400).json({
          msg: "E-mail ou senha incorretos!",
        });
      }

      const isValida = await bcrypt.compare(senha, adm.senha);
      if (!isValida) {
        return res.status(400).json({
          msg: "E-mail ou senha incorretos!",
        });
      }

      const token = jwt.sign(
        { id: adm.id, email: adm.email },
        process.env.SECRET,
        { expiresIn: "10h" }
      );

      return res.status(200).json({
        msg: "Login realizado",
        token,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({
        msg: "Erro interno no servidor",
      });
    }
  },

  create: async (req, res) => {
    const { nome, email, senha, idade } = req.body;

    try {
      // Verifica se o e-mail já está em uso
      const existingAdmin = await Administrador.findOne({ where: { email } });
      if (existingAdmin) {
        return res.status(400).json({
          msg: "E-mail já está em uso",
        });
      }

      // Cria uma hash para a senha
      const hashedSenha = await bcrypt.hash(senha, 10);

      const admin = await Administrador.create({
        nome,
        email,
        idade,
        senha: hashedSenha,
      });

      return res.status(201).json({
        msg: "Administrador criado com sucesso",
        admin: {
          id: admin.id,
          nome: admin.nome,
          idade: admin.idade,
          email: admin.email,
          // Não retorne a senha
        },
      });
    } catch (error) {
      console.error("Erro ao criar administrador:", error);
      return res.status(500).json({
        msg: "Erro ao tentar criar o administrador",
      });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    try {
      const admin = await Administrador.findByPk(id);
      if (!admin) {
        return res.status(404).json({
          msg: "Administrador não encontrado",
        });
      }

      // Atualiza os campos fornecidos
      if (nome) admin.nome = nome;
      if (email) admin.email = email;
      if (senha) {
        const hashedSenha = await bcrypt.hash(senha, 10);
        admin.senha = hashedSenha;
      }

      await admin.save();

      return res.status(200).json({
        msg: "Administrador atualizado com sucesso!",
        admin: {
          id: admin.id,
          nome: admin.nome,
          email: admin.email,
          // Não retorne a senha
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar administrador:", error);
      return res.status(500).json({
        msg: "Erro ao tentar atualizar o administrador",
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const admins = await Administrador.findAll({
        attributes: { exclude: ["senha"] }, // Exclui a senha da resposta
      });

      if (admins.length === 0) {
        return res.status(404).json({
          msg: "Nenhum administrador encontrado",
        });
      }

      return res.status(200).json({
        msg: "Todos os administradores",
        admins,
      });
    } catch (error) {
      console.error("Erro ao buscar administradores:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },

  getOne: async (req, res) => {
    const { id } = req.params;

    try {
      const admin = await Administrador.findByPk(id, {
        attributes: { exclude: ["senha"] }, // Exclui a senha da resposta
      });

      if (!admin) {
        return res.status(404).json({
          msg: "Administrador não encontrado",
        });
      }

      return res.status(200).json({
        msg: "Administrador encontrado",
        admin,
      });
    } catch (error) {
      console.error("Erro ao buscar administrador:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    try {
      const admin = await Administrador.findByPk(id);

      if (!admin) {
        return res.status(404).json({
          msg: "Administrador não encontrado",
        });
      }

      await admin.destroy();

      return res.status(200).json({
        msg: "Administrador deletado com sucesso!",
        admin: {
          id: admin.id,
          nome: admin.nome,
          email: admin.email,
          // Não retorne a senha
        },
      });
    } catch (error) {
      console.error("Erro ao deletar administrador:", error);
      return res.status(500).json({
        msg: "Ocorreu um erro no servidor",
      });
    }
  },
};

module.exports = adminController;
