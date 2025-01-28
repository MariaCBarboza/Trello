import { Router } from 'express';
import * as listService from '../service/auth/listService.js'


const router = Router();

router.post('/', async (req, res) => {
    try {
        const list = await listService.createList(req.body);
        return res.status(201).json(list);
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        res.status(400).json({ error: 'Erro ao criar lista' });
    }
});


router.get('/board/:boardId', async (req, res) => {
    try {
        const { boardId } = req.params;
        const lists = await listService.getListsByBoardId(boardId);
        return res.status(200).json(lists);
    } catch (error) {
        console.error('Erro ao listar listas:', error);
        res.status(400).json({ error: 'Erro ao listar listas' });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedList = await listService.updateList(id, req.body);
        return res.status(200).json(updatedList);
    } catch (error) {
        console.error('Erro ao atualizar lista:', error);
        res.status(error.status || 400).json({ error: error.message });
    }
});

// 4) Remover uma lista
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const message = await listService.deleteList(id);
        return res.status(200).json(message);
    } catch (error) {
        console.error('Erro ao remover lista:', error);
        res.status(error.status || 400).json({ error: error.message });
    }
});
router.get('/board/:boardId/title/:title', async (req, res) => {
    try {
        const { boardId, title } = req.params;
        const list = await listService.getListByTitle(boardId, title);
        if (!list) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }
        res.status(200).json(list);
    } catch (error) {
        console.error('Erro ao buscar lista pelo título:', error);
        res.status(500).json({ error: 'Erro ao buscar lista pelo título' });
    }
});
export default router;