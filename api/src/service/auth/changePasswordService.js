import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../../models/User.js';

const changePassword = async (req, res) => {
    const { email, novaSenha } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(novaSenha, salt);

        await user.save();

        res.json({ message: 'Senha alterada com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

export default changePassword;