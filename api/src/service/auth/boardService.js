import Board from '../../models/Board.js';
import BoardPermissions from '../../models/BoardPermissions.js';


export const getAllBoards = async () => {
    return await Board.find().populate('lists');
};

export const getBoardById = async (id, userId) => {
    const board = await Board.findById(id).populate('lists');

    if (!board) {
        throw { status: 404, message: 'Board não encontrado.' };
    }

    if (board.owner.toString() !== userId) {
        const permission = await BoardPermissions.findOne({ board: board._id, user: userId });
        if (!permission) {
            throw { status: 403, message: 'Acesso negado.' };
        }
    }

    return board;
};

export const getBoardsByUser = async (userId) => {
    return await Board.find({ owner: userId }).populate('lists');
}

export const createBoard = async (data, userId) => {
    const { title, backgroundColor, textColor, isFavorite, lists } = data;

    const newBoard = await Board.create({
        title,
        backgroundColor,
        textColor,
        isFavorite,
        owner: userId,
        lists,
    });


    await BoardPermissions.create({
        board: newBoard._id,
        user: userId,
        canEdit: true,
    });

    return newBoard;
};


export const updateBoard = async (id, data) => {
    const { title, backgroundColor, textColor, isFavorite, lists } = data;

    const updatedBoard = await Board.findByIdAndUpdate(
        id,
        { title, backgroundColor, textColor, isFavorite, lists },
        { new: true }
    ).populate('lists');

    if (!updatedBoard) {
        throw { status: 404, message: 'Board não encontrado.' };
    }

    return updatedBoard;
};


export const deleteBoard = async (id) => {
    const board = await Board.findByIdAndDelete(id);

    if (!board) {
        throw { status: 404, message: 'Board não encontrado.' };
    }

    return { message: 'Board removido com sucesso' };
};
