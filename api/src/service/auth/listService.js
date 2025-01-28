import List from '../../models/List.js';
import Board from '../../models/Board.js';
import Card from '../../models/Card.js';

export const createList = async (data) => {
    const { title, boardId, position, cards } = data;
    const list = await List.create({ title, boardId, position, cards });
    await Board.findByIdAndUpdate(boardId, { $push: { lists: list._id } });
    return list;
};

export const getListsByBoardId = async (boardId) => {
    return await List.find({ boardId }).sort({ position: 1 }).populate('cards');
};

export const updateList = async (id, data) => {
    const { title, position, cards } = data;

    const updatedList = await List.findByIdAndUpdate(
        id,
        { title, position, cards },
        { new: true }
    ).populate('cards');

    if (!updatedList) {
        throw { status: 404, message: 'Lista não encontrada' };
    }

    return updatedList;
};

export const deleteList = async (id) => {
    const list = await List.findById(id);

    if (!list) {
        throw { status: 404, message: 'Lista não encontrada' };
    }

    await Card.deleteMany({ _id: { $in: list.cards } });
    await Board.findByIdAndUpdate(list.boardId, { $pull: { lists: list._id } });
    await list.deleteOne();
    return { message: 'Lista removida com sucesso' };
};
