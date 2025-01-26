const Colecao = require('../../models/Colecao');
const Quadro = require('../../models/Quadro');

// Criar uma coleção
exports.criarColecao = async (req, res) => {
    try {
        const { nome } = req.body;
        const owner = req.user.id;

        const novaColecao = new Colecao({ nome, owner });
        await novaColecao.save();

        return res.status(201).json({ message: "Coleção criada com sucesso.", novaColecao });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar coleção." });
    }
};

// Remover uma coleção
exports.deletarColecao = async (req, res) => {
    try {
        const { colecaoId } = req.body;

        const colecaoDeletada = await Colecao.findByIdAndDelete(colecaoId);
        if (!colecaoDeletada) {
            return res.status(404).json({ message: "Coleção não encontrada." });
        }

        return res.status(200).json({ message: "Coleção deletada com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar coleção." });
    }
};

// Adicionar um quadro a uma coleção
exports.adicionarQuadro = async (req, res) => {
    try {
        const { colecaoId, quadroId } = req.body;

        const colecao = await Colecao.findById(colecaoId);
        if (!colecao) {
            return res.status(404).json({ message: "Coleção não encontrada." });
        }

        colecao.quadros.push(quadroId);
        await colecao.save();

        return res.status(200).json({ message: "Quadro adicionado à coleção com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao adicionar quadro à coleção." });
    }
};

// Remover um quadro de uma coleção
exports.removerQuadro = async (req, res) => {
    try {
        const { colecaoId, quadroId } = req.body;

        const colecao = await Colecao.findById(colecaoId);
        if (!colecao) {
            return res.status(404).json({ message: "Coleção não encontrada." });
        }

        colecao.quadros.pull(quadroId);
        await colecao.save();

        return res.status(200).json({ message: "Quadro removido da coleção com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao remover quadro da coleção." });
    }
};
