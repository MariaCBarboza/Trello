import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../../models/User.js';

export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, senha } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const user = new User({
            nome,
            email,
            senha: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};