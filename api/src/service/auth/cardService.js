import Card from '../../models/Card.js';
import List from '../../models/List.js';


export const getAllCards = async () => {
    return await Card.find();
};

export const getCardById = async (id) => {
    const card = await Card.findById(id);
    if (!card) {
        throw { status: 404, message: "Card não encontrado." };
    }
    return card;
};


export const createCard = async (data) => {
    const { nome, usuario, descricao, quadro, coluna, dataInicio, dataFim } = data;

    if (!nome || !usuario || !quadro || !coluna) {
        throw { status: 400, message: "Campos obrigatórios não preenchidos." };
    }

   
    const card = new Card({ nome, usuario, descricao, quadro, coluna, dataInicio, dataFim });
    await card.save();

    await List.findByIdAndUpdate(coluna, { $push: { cards: card._id } });

    return card;
};


export const deleteCard = async (id) => {
    const card = await Card.findById(id);

    if (!card) {
        throw { status: 404, message: "Card não encontrado." };
    }

 
    await card.deleteOne();

    return { message: `Card ID ${id} removido com sucesso.` };
};
