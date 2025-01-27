const Lista = require('../../models/Lista');
const Quadro = require('../../models/Quadro');

// Criar uma lista
exports.criarLista = async (req, res) => {
    try {
        const { titulo, quadroId } = req.body;

        // Verifica se o quadro existe
        const quadro = await Quadro.findById(quadroId);
        if (!quadro) {
            return res.status(404).json({ message: "Quadro não encontrado." });
        }

        // Cria a lista
        const novaLista = new Lista({ titulo, quadroId });
        await novaLista.save();

        // Adiciona a lista ao quadro
        quadro.listas.push(novaLista._id);
        await quadro.save();

        return res.status(201).json({ message: "Lista criada com sucesso", novaLista });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar a lista." });
    }
};

// Atualizar título de uma lista
exports.atualizarLista = async (req, res) => {
    try {
        const { listaId, novoTitulo } = req.body;

        const listaAtualizada = await Lista.findByIdAndUpdate(
            listaId,
            { titulo: novoTitulo },
            { new: true }
        );

        if (!listaAtualizada) {
            return res.status(404).json({ message: "Lista não encontrada." });
        }

        return res.status(200).json({ message: "Lista atualizada com sucesso.", listaAtualizada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar a lista." });
    }
};

// Reordenar listas no quadro
exports.reordenarListas = async (req, res) => {
    try {
        const { quadroId, novaOrdemListas } = req.body;

        const quadro = await Quadro.findById(quadroId);
        if (!quadro) {
            return res.status(404).json({ message: "Quadro não encontrado." });
        }

        // Verifica se a nova ordem de listas é válida
        const idsOriginais = quadro.listas.map(id => id.toString());
        const novaOrdemIds = novaOrdemListas.map(id => id.toString());

        if (!novaOrdemIds.every(id => idsOriginais.includes(id)) || idsOriginais.length !== novaOrdemIds.length) {
            return res.status(400).json({ message: "Nova ordem de listas inválida." });
        }

        quadro.listas = novaOrdemListas;
        await quadro.save();

        return res.status(200).json({ message: "Listas reordenadas com sucesso.", quadro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao reordenar as listas." });
    }
};

// Deletar uma lista
exports.deletarLista = async (req, res) => {
    try {
        const { listaId, quadroId } = req.body;

        // Remove a lista
        const lista = await Lista.findByIdAndDelete(listaId);
        if (!lista) {
            return res.status(404).json({ message: "Lista não encontrada." });
        }

        // Remove a lista do quadro associado
        await Quadro.findByIdAndUpdate(
            quadroId,
            { $pull: { listas: listaId } }
        );

        return res.status(200).json({ message: "Lista deletada com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar a lista." });
    }
};

exports.buscarListas = async(req,res) =>{
    try
    {
        const listas = await quadroService.resgatarListasDoQuadro(req.body.quadroId);
        res.json(listas);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor'})
    }
};

