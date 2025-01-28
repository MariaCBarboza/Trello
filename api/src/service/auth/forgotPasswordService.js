import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';  // Certifique-se de que o caminho está correto
import nodemailer from 'nodemailer';

const router = Router();

// Configurar transporte de email (nodemailer)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bernmedman@gmail.com",
    pass: "jnrr bcns ybdd kjbq"  // Use a senha do aplicativo gerada
  },
});

// Esqueci minha senha
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Criar token para redefinição de senha
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });

    // Enviar email com o link de redefinição de senha
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: "bernmedman@gmail.com",
      to: email,
      subject: 'Redefinição de Senha',
      html: `
        <h1>Redefinição de Senha</h1>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.status(200).json({ message: 'Email de redefinição de senha enviado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar redefinição de senha.', error: error.message });
  }
});



export default router;
