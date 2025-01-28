import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = Router();

// Rota para obter os dados do usu�rio
router.get('/profile', getUserProfile);

// Rota para atualizar os dados do usu�rio
router.put('/profile', updateUserProfile);

export default router;
