const express = require('express');
const { check } = require('express-validator');
const quadroService = require('../service/quadro/quadroService.js');
const auth = require('../middleware/auth.js');
const Quadro = require ('../models/Quadro.js')

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

router.delete('/deletarQuadro/:id', auth, async (req, res) => {
    const { id } = req.params;
  
    try {
      const quadro = await Quadro.findByIdAndDelete(id); // Substitua "Quadro" pelo seu modelo
      if (!quadro) {
        return res.status(404).json({ message: 'Quadro não encontrado' });
      }
      res.status(200).json({ message: 'Quadro deletado com sucesso', quadro });
    } catch (error) {
      console.error('Erro ao deletar quadro:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });
  
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