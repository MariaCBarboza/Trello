import express from 'express';
import { check } from 'express-validator';
import { register } from '../service/auth/authService.js';
import login from '../service/auth/loginService.js';
import changePassword from '../service/auth/changePasswordService.js';
import forgotPassword from '../service/auth/forgotPasswordService.js';

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
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', changePassword);

export default router;