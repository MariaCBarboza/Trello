import Board from '../../models/Board.js';
import BoardPermissions from '../../models/BoardPermissions.js';
import List from '../../models/List.js';

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

export const getBoardDetails = async (req, res) => {
    try {
        // Pegue o ID do quadro a partir dos parâmetros da requisição
        const boardId = req.params.boardId;
    
        // Encontre o quadro com o ID especificado e populando as listas e cards
        const board = await Board.findById(boardId)
          .populate({
            path: 'lists', // Populando as listas dentro do quadro
            populate: {
              path: 'cards', // Populando os cards dentro de cada lista
              select: 'descricao', // Incluindo campos específicos dos cards, por exemplo, título e descrição
            }
          })
          .exec();
    
        if (!board) {
          return res.status(404).json({ message: 'Quadro não encontrado' });
        }
    
        // Retorna os detalhes do quadro com listas e cards
        res.status(200).json(board);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar os detalhes do quadro' });
      }
    };
    
