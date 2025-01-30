import { Router } from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import * as boardService from '../service/auth/boardService.js';
import { getBoardDetails } from '../service/auth/boardService.js';

const router = Router();

// Aplicar o middleware de autenticação a todas as rotas de boards//
router.use(authenticateToken); 

router.get('/', async (req, res) => {
    try {
        const boards = await boardService.getAllBoards();
        res.json(boards);
    } catch (error) {
        console.error("Erro ao buscar os boards:", error);
        res.status(500).json({ error: 'Erro ao buscar boards' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const board = await boardService.getBoardById(req.params.id, req.user.id);
        res.json(board);
    } catch (error) {
        console.error("Erro ao buscar board:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newBoard = await boardService.createBoard(req.body, req.user.id);
        res.status(201).json(newBoard);
    } catch (error) {
        console.error('Erro ao criar board:', error);
        res.status(500).json({ error: 'Erro ao criar board' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedBoard = await boardService.updateBoard(req.params.id, req.body);
        res.json(updatedBoard);
    } catch (error) {
        console.error('Erro ao atualizar board:', error);
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const message = await boardService.deleteBoard(req.params.id);
        res.json(message);
    } catch (error) {
        console.error('Erro ao remover board:', error);
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.get('/boards/:boardId', getBoardDetails);


export default router;