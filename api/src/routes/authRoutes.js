import express from 'express';
import { check } from 'express-validator';
import { register } from '../service/auth/authService.js';
import login from '../service/auth/loginService.js';
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
        const { currentPassword, newPassword } = req.body;

        // Verifique se as senhas foram passadas corretamente
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Por favor, forneça tanto a senha atual quanto a nova senha." });
        }

        const userId = req.user.id;
        console.log('User ID:', userId); // Log do userId

        const user = await User.findById(userId).select("+senha"); // Ajustado para "senha"

        // Verifique se o usuário foi encontrado
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Verifique as senhas
        console.log('Senha recuperada do banco de dados:', user.senha); // Ajustado para "senha"
        console.log('Senha atual fornecida:', currentPassword);

        if (!user.senha || !currentPassword) {
            return res.status(400).json({ message: "Senha atual ou senha do usuário não encontrada." });
        }

        // Comparação da senha
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.senha); // Ajustado para "senha"

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Senha atual incorreta." });
        }

        // Criptografando a nova senha
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.senha = hashedNewPassword; // Ajustado para "senha"

        await user.save();

        return res.status(200).json({ message: "Senha alterada com sucesso." });

    } catch (error) {
        console.error('Erro ao alterar senha:', error); // Log do erro
        res.status(500).json({ message: "Erro ao alterar senha.", error: error.message });
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