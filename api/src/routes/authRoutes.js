import express from 'express';
import { check } from 'express-validator';
import { register } from '../service/auth/authService.js';
import login from '../service/auth/loginService.js';
import changePassword from '../service/auth/changePasswordService.js';
import forgotPassword from '../service/auth/forgotPasswordService.js';
import authenticateToken from '../middleware/authenticateToken.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post(
    '/register',
    [
        check('nome', 'O nome é obrigatório').not().isEmpty(),
        check('email', 'Por favor insira um e-mail válido').isEmail(),
        check('senha', 'A senha deve ter pelo menos 6 caracteres').isLength({ min: 6 }),
    ],
    register
);

router.post('/login', login
);

router.post('/forgot-password', forgotPassword);

router.post("/change-password", authenticateToken, async (req, res) => {
    try {
        console.log('0');
        const { currentPassword, newPassword } = req.body;
        console.log('0,5');
        const userId = req.user.id; // Supondo que o middleware de autenticação adiciona `req.user`
        console.log('1');
        const user = await User.findById(userId).select("+password");
        console.log('2');
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        console.log('3');
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );
        console.log('4');
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Senha atual incorreta." });
        }
        console.log('5');
        user.password = newPassword;
        await user.save();
        console.log('6');
        res.status(200).json({ message: "Senha alterada com sucesso." });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Erro ao alterar senha.", error: error.message });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Verifique se o token e a nova senha foram enviados
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token e nova senha são necessários.' });
        }

        // Verifique o token
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        // Encontre o usuário pelo id extraído do token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Criptografe a nova senha antes de salvar
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.senha = hashedPassword;

        // Salve o usuário com a nova senha
        await user.save();

        res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);  // Exibe detalhes do erro no console
        res.status(500).json({ message: 'Erro ao redefinir a senha', error: error.message });
    }
});


export default router;