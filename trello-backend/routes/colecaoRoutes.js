const express = require('express');
const { check } = require('express-validator');
const colecaoService = require('../service/colecao/colecaoService');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// Criar coleção
router.post(
    '/criarColecao',
    [
        check('nome', 'Nome é obrigatório').not().isEmpty(),
    ],
    colecaoService.criarColecao
);

// Deletar coleção
router.delete(
    '/deletarColecao',
    [
        check('colecaoId', 'ID da coleção é obrigatório').not().isEmpty(),
    ],
    colecaoService.deletarColecao
);

// Adicionar quadro a uma coleção
router.post(
    '/adicionarQuadro',
    [
        check('colecaoId', 'ID da coleção é obrigatório').not().isEmpty(),
        check('quadroId', 'ID do quadro é obrigatório').not().isEmpty(),
    ],
    colecaoService.adicionarQuadro
);

// Remover quadro de uma coleção
router.post(
    '/removerQuadro',
    [
        check('colecaoId', 'ID da coleção é obrigatório').not().isEmpty(),
        check('quadroId', 'ID do quadro é obrigatório').not().isEmpty(),
    ],
    colecaoService.removerQuadro
);

module.exports = router;
