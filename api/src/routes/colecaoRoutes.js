import { Router } from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import * as collectionService from '../service/auth/colecaoService.js';

const router = Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const collections = await collectionService.getUserCollections(req.user.id);
        res.json(collections);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar coleções' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCollection = await collectionService.createCollection(req.body, req.user.id);
        res.status(201).json(newCollection);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar coleção' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await collectionService.deleteCollection(req.params.id);
        res.json({ message: 'Coleção removida com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover coleção' });
    }
});

// Rota de atualização de coleção
router.put('/:id', async (req, res) => {
    try {
        const updatedCollection = await collectionService.updateCollection(req.params.id, req.body);
        if (!updatedCollection) {
            return res.status(404).json({ error: 'Coleção não encontrada' });
        }
        res.json(updatedCollection);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar coleção' });
    }
});

export default router;
