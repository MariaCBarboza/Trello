const Card = require('../../models/Card');
const Lista = require('../../models/Lista');

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
