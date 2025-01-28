import { Router } from 'express';
import * as cardService from '../service/auth/cardService.js';
import authenticateToken from '../middleware/authenticateToken.js';
import multer from 'multer';
import Card from '../models/Card.js';

const router = Router();

const storage = multer.diskStorage({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads')); // Diretório de armazenamento
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`); // Nome do arquivo
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos PDF são permitidos!'));
        }
    },
  });

  

const upload = multer({ storage });

// Middleware para autenticação (caso necessário)
router.use(authenticateToken);

// Buscar todos os cards
router.get("/", async (req, res) => {
    try {
        const cards = await cardService.getAllCards();
        res.status(200).json(cards);
    } catch (err) {
        console.error("Erro ao buscar os cards:", err);
        res.status(500).json({ error: "Erro ao buscar os cards." });
    }
});

// Buscar um card pelo ID
router.get('/:id', async (req, res) => {
    try {
        const card = await cardService.getCardById(req.params.id);
        res.status(200).json(card);
    } catch (err) {
        console.error("Erro ao buscar o card:", err);
        res.status(err.status || 500).json({ error: err.message });
    }
});

// Criar um novo card
router.post('/', async (req, res) => {
    try {
        const card = await cardService.createCard(req.body);
        res.status(201).json({ message: "O card foi criado.", card });
    } catch (err) {
        console.error("Erro ao criar o card:", err);
        res.status(err.status || 500).json({ error: err.message });
    }
});

// Remover um card pelo ID
router.delete('/:id', async (req, res) => {
    try {
        const message = await cardService.deleteCard(req.params.id);
        res.status(200).json(message);
    } catch (err) {
        console.error("Erro ao remover o card:", err);
        res.status(err.status || 500).json({ error: err.message });
    }
});
// Mover um card para outra lista
router.put('/move/:id', async (req, res) => {
    try {
        const { newColumnId } = req.body;
        console.log(`Recebendo solicitação para mover card ID ${req.params.id} para coluna ${newColumnId}`); // Adicione log

        const card = await cardService.moveCard(req.params.id, newColumnId);
        res.status(200).json(card);
    } catch (err) {
        console.error("Erro ao mover o card:", err);
        res.status(err.status || 500).json({ error: err.message });
    }
});

router.post('/api/cards/:cardId/attachments', upload.single('file'), async (req, res) => {
    const { cardId } = req.params;
    const file = req.file;
  
    try {
      // Encontre o cartão
      const card = await Card.findById(cardId);
      if (!card) {
        return res.status(404).json({ message: 'Cartão não encontrado.' });
      }
  
      // Adicione o anexo ao cartão
      const attachment = {
        filename: file.originalname,
        url: `/uploads/${file.filename}`, // Caminho do arquivo
      };
      card.attachments.push(attachment);
      await card.save();
  
      res.status(200).json({ message: 'Arquivo anexado com sucesso.', attachment });
    } catch (error) {
      console.error('Erro ao anexar arquivo:', error);
      res.status(500).json({ message: 'Erro ao anexar arquivo.' });
    }
  });
  
  // Endpoint para listar os anexos de um cartão
  router.get('/api/cards/:cardId/attachments', async (req, res) => {
    const { cardId } = req.params;
  
    try {
      const card = await Card.findById(cardId);
      if (!card) {
        return res.status(404).json({ message: 'Cartão não encontrado.' });
      }
  
      res.status(200).json({ attachments: card.attachments });
    } catch (error) {
      console.error('Erro ao obter anexos:', error);
      res.status(500).json({ message: 'Erro ao obter anexos.' });
    }
  });

  router.post('/cards/:cardId/upload', upload.single('file'), async (req, res) => {
    try {
        const cardId = req.params.cardId;
        const filePath = `/uploads/${req.file.filename}`;
        
        // Atualizar o cartão com o caminho do arquivo
        const Card = require('../models/Card');
        const card = await Card.findById(cardId);
        if (!card) return res.status(404).json({ message: 'Cartão não encontrado' });

        card.anexos.push(filePath);
        await card.save();

        res.status(200).json({ message: 'Arquivo anexado com sucesso!', filePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao anexar arquivo', error });
    }

export default router;
