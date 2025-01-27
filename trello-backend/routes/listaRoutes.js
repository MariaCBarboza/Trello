const express = require('express');
const { check } = require('express-validator');
const listaService = require('../service/lista/listaService');
const auth = require('../middleware/auth');


const router = express.Router();
router.use(auth);

// Criar uma lista
router.post(
    '/criarLista',
    [
        check('titulo', 'Título é obrigatório').not().isEmpty(),
        check('quadroId', 'ID do quadro é obrigatório').not().isEmpty(),
    ],
    listaService.criarLista
);

// Atualizar título de uma lista
router.put(
    '/atualizarLista',
    [
        check('listaId', 'ID da lista é obrigatório').not().isEmpty(),
        check('novoTitulo', 'Novo título é obrigatório').not().isEmpty(),
    ],
    listaService.atualizarLista
);

// Reordenar listas
router.put(
    '/reordenarListas',
    [
        check('quadroId', 'ID do quadro é obrigatório').not().isEmpty(),
        check('novaOrdemListas', 'Nova ordem das listas é obrigatória').isArray(),
    ],
    listaService.reordenarListas
);

// Deletar uma lista
router.delete(
    '/deletarLista',
    [
        check('listaId', 'ID da lista é obrigatório').not().isEmpty(),
        check('quadroId', 'ID do quadro é obrigatório').not().isEmpty(),
    ],
    listaService.deletarLista
);
router.get(
    '/resgatarListas',
    listaService.buscarListas
);
module.exports = router;
