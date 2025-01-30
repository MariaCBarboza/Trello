import { Router } from 'express';
import * as cardService from '../service/auth/cardService.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = Router();

// Middleware para autenticação (caso necessário)
router.use(authenticateToken);

// Rota para buscar todos os cards
router.get("/", async (req, res) => {
    try {
        const cards = await cardService.getAllCards();
        res.status(200).json(cards);
    } catch (err) {
        console.error("Erro ao buscar os cards:", err);
        res.status(500).json({ error: "Erro ao buscar os cards." });
    }
});

// Rota para buscar um card pelo ID
router.get('/:id', async (req, res) => {
    try {
        const card = await cardService.getCardById(req.params.id);
        res.status(200).json(card);
    } catch (err) {
        console.error("Erro ao buscar o card:", err);
        res.status(err.status || 500).json({ error: err.message });
    }
});

// Rota para criar um novo card
router.post('/', async (req, res) => {
    try {
        const card = await cardService.createCard(req.body);
        res.status(201).json({ message: "O card foi criado.", card });
    } catch (err) {
        console.error("Erro ao criar o card:", err);
        res.status(err.status || 500).json({ error: err.message });
    }
});

// Rota para remover um card pelo ID
router.delete('/:id', async (req, res) => {
    try {
        const message = await cardService.deleteCard(req.params.id);
        res.status(200).json(message);
    } catch (err) {
        console.error("Erro ao remover o card:", err);
        res.status(err.status || 500).json({ error: err.message });
    }
});

// Rota para mover um card para outra lista
router.put('/move/:id', async (req, res) => {
    try {
        const { newColumnId } = req.body;
        console.log(`Recebendo solicitação para mover card ID ${req.params.id} para coluna ${newColumnId}`);

        const card = await cardService.moveCard(req.params.id, newColumnId);
        res.status(200).json(card);
    } catch (err) {
        console.error("Erro ao mover o card:", err);
        res.status(err.status || 500).json({ error: err.message });
    }
});



export default router;
