const express = require('express');
const { check } = require('express-validator');
const quadroService = require('../service/quadroService/quadroService.js');
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


module.exports = router;
