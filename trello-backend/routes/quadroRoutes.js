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


module.exports = router;
