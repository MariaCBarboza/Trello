const express = require('express');
const { check } = require('express-validator');
const listaService = require('../service/lista/listaService.js');
const auth = require('../middleware/auth.js');

const router = express.Router();
router.use(auth);

router.post(
    '/criarLista',
    [
        check('titulo', "Titulo é obrigatorio").not().isEmpty(),
    ],
    listaService.criarLista
);
router.put(
    '/alterarTituloLista',
    [
        check('titulo', "Titulo é obrigatorio").not().isEmpty(),
    ],
    listaService.alterarTitulo
);
router.delete(
    '/deletarLista',
    listaService.deletarLista
);
router.get(
    '/resgatarListas',
    listaService.buscarListas
);
module.exports = router;