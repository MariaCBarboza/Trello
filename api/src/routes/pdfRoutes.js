import express from 'express';
import multer from 'multer';
import path from 'path';
import Card from '../models/Card.js';

const router = express.Router();

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Diretório onde os PDFs serão salvos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Gerar nome único
  }
});

// Filtrar apenas arquivos PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Aceitar PDF
  } else {
    cb(new Error('Arquivo não permitido. Apenas PDFs são aceitos.'));
  }
};

// Inicializando o Multer
const upload = multer({ storage, fileFilter });

// Rota para fazer o upload de anexos (PDF)
router.post('/:cardId/attachments', upload.single('file'), async (req, res) => {
  try {
    const { cardId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    // Buscando o card no banco de dados
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: 'Card não encontrado.' });
    }

    // Adicionando o nome do arquivo ao array de anexos do card
    card.anexos.push(file.filename); // Aqui estamos salvando o nome do arquivo

    await card.save(); // Salvando o card com o anexo

    res.status(200).json({ message: 'Arquivo enviado com sucesso!', attachment: { filename: file.filename } });
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    res.status(500).json({ message: 'Erro ao fazer upload do arquivo.', error: error.message });
  }
});

// Rota para listar os anexos de um card
router.get('/:cardId/attachments', async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: 'Card não encontrado.' });
    }

    res.status(200).json(card.anexos.map(filename => ({ filename }))); // Retornando os anexos
  } catch (error) {
    console.error('Erro ao listar anexos:', error);
    res.status(500).json({ message: 'Erro ao listar anexos.', error: error.message });
  }
});

// Rota para remover um anexo
router.delete('/:cardId/attachments/:filename', async (req, res) => {
  try {
    const { cardId, filename } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: 'Card não encontrado.' });
    }

    // Remover o anexo do array de anexos
    card.anexos = card.anexos.filter(item => item !== filename);
    await card.save();

    res.status(200).json({ message: 'Anexo removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover anexo:', error);
    res.status(500).json({ message: 'Erro ao remover anexo.', error: error.message });
  }
});

export default router;
