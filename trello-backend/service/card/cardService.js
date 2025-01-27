
const Card = require('../../models/Card');
const Lista = require('../../models/Lista');
const multer = require('multer');
const path = require('path');

// Criar um cartão
exports.criarCard = async (req, res) => {
    try {
        const { texto, listaId } = req.body;

        const lista = await Lista.findById(listaId);
        if (!lista) {
            return res.status(404).json({ message: "Lista não encontrada." });
        }

        const novoCard = new Card({ texto });
        await novoCard.save();

        lista.cards.push(novoCard._id);
        await lista.save();

        return res.status(201).json({ message: "Card criado com sucesso.", novoCard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar o card." });
    }
};

// Mover um cartão para outra lista
exports.moverCard = async (req, res) => {
    try {
        const { cardId, listaOrigemId, listaDestinoId } = req.body;

        const listaOrigem = await Lista.findById(listaOrigemId);
        const listaDestino = await Lista.findById(listaDestinoId);

        if (!listaOrigem || !listaDestino) {
            return res.status(404).json({ message: "Uma ou ambas as listas não foram encontradas." });
        }

        // Remover o cartão da lista de origem
        listaOrigem.cards.pull(cardId);
        await listaOrigem.save();

        // Adicionar o cartão na lista de destino
        listaDestino.cards.push(cardId);
        await listaDestino.save();

        return res.status(200).json({ message: "Card movido com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao mover o card." });
    }
};

// Deletar um cartão
exports.deletarCard = async (req, res) => {
    try {
        const { cardId, listaId } = req.body;

        const lista = await Lista.findById(listaId);
        if (!lista) {
            return res.status(404).json({ message: "Lista não encontrada." });
        }

        // Remove o cartão da lista
        lista.cards.pull(cardId);
        await lista.save();

        // Remove o cartão do banco de dados
        await Card.findByIdAndDelete(cardId);

        return res.status(200).json({ message: "Card deletado com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar o card." });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/pdf'); // Diretório onde os PDFs serão salvos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos PDF são permitidos.'));
        }
    }
});

// Anexar PDF a um cartão
exports.anexarPDF = async (req, res) => {
    try {
        const { cardId } = req.body;

        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card não encontrado." });
        }

        // Adiciona o caminho do PDF ao campo `anexos` no cartão
        card.anexos.push(req.file.path);
        await card.save();

        return res.status(200).json({ message: "PDF anexado com sucesso.", card });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao anexar o PDF." });
    }
};

// Visualizar PDFs anexados a um cartão
exports.visualizarAnexos = async (req, res) => {
    try {
        const { cardId } = req.params;

        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card não encontrado." });
        }

        return res.status(200).json({ anexos: card.anexos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar anexos." });
    }
};

