const express = require('express');
const { check } = require('express-validator');
const quadroService = require('../service/quadro/quadroService.js');
const auth = require('../middleware/auth.js');


const router = express.Router();

router.use(auth);
router.post(
    '/criarQuadro',
    [
        check('titulo',"Titulo é obrigatorio").not().isEmpty(),        
    ],
    quadroService.criarQuadro
);
router.get(
    '/pegarQuadros',
    quadroService.pegarQuadros
);
router.put('/atualizarQuadro',
    [
        check('titulo', "Titulo é obrigatorio").not().isEmpty(),
        check('id', "Id é necessario").not().isEmpty(),
    ],
    quadroService.atualizarQuadro
);
router.delete('/deletarQuadro',
    [
        check('id', "Id é necessario").not().isEmpty(),
    ],
    quadroService.deletarQuadro
);
router.put(
    '/reordenarListas',
    quadroService.reordenarListasDoQuadro
);

router.put(
    '/alternarFavorito',
    [
        check('quadroId', 'ID do quadro é obrigatório').not().isEmpty(),
    ],
    quadroService.alternarFavorito
);

router.post(
    '/compartilharQuadro',
    [
        check('quadroId', 'ID do quadro é obrigatório').not().isEmpty(),
        check('emailUsuario', 'E-mail do usuário é obrigatório').isEmail(),
        check('permissao', 'Permissão deve ser "editar" ou "visualizar"').isIn(['editar', 'visualizar']),
    ],
    quadroService.compartilharQuadro
);

module.exports = router;