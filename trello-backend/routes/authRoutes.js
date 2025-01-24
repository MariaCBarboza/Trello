const express = require('express');
const { check } = require('express-validator');
const authController = require('../service/authService');
const loginController = require('../service/loginService');
const changePasswordController  = require('../service/changePasswordService');
const forgotPasswordController = require('../service/forgotPasswordService');


const router = express.Router();


router.post(
    '/register',
    [
        check('nome', 'O nome é obrigatório').not().isEmpty(),
        check('email', 'Por favor insira um e-mail válido').isEmail(),
        check('senha', 'A senha deve ter pelo menos 6 caracteres').isLength({ min: 6 }),
    ],
    authController.register
);
router.post('/login', loginController.login);
router.post('/forgot-password', forgotPasswordController.forgotPassword);
router.post('/change-password', changePasswordController.changePassword);

module.exports = router;
