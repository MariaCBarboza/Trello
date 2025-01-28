import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../../models/User.js';

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        // Gerar token de recuperação (simulação)
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Enviar token por e-mail (simulação)
        console.log(`Token de recuperação: ${resetToken}`);

        res.json({ message: 'Token de recuperação enviado por e-mail!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

export default forgotPassword;