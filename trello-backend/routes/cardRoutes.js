const express = require('express');
const { check } = require('express-validator');
const cardService = require('../service/card/cardService');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// Criar um cartão
router.post(
    '/criarCard',
    [
        check('texto', 'Texto é obrigatório').not().isEmpty(),
        check('listaId', 'ID da lista é obrigatório').not().isEmpty(),
    ],
    cardService.criarCard
);

// Mover um cartão
router.put(
    '/moverCard',
    [
        check('cardId', 'ID do card é obrigatório').not().isEmpty(),
        check('listaOrigemId', 'ID da lista de origem é obrigatório').not().isEmpty(),
        check('listaDestinoId', 'ID da lista de destino é obrigatório').not().isEmpty(),
    ],
    cardService.moverCard
);

// Deletar um cartão
router.delete(
    '/deletarCard',
    [
        check('cardId', 'ID do card é obrigatório').not().isEmpty(),
        check('listaId', 'ID da lista é obrigatória').not().isEmpty(),
    ],
    cardService.deletarCard
);

module.exports = router;
