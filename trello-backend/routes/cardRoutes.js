const express = require('express');
const { check } = require('express-validator');
const cardService = require('../service/card/cardService.js');
const auth = require('../middleware/auth.js');

const router = express.Router();
router.use(auth);
router.post(
    '/criarCard',
    [
        check('titulo', 'titulo é obrigatorio').not().isEmpty(),
    ],
    cardService.criarCard
);

module.exports = router;