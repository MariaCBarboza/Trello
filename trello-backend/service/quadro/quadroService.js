const Quadro = require("../../models/Quadro");
const router = require("../../routes/authRoutes");


exports.criarQuadro = async(req, res) =>{
    
    try{
        const { titulo, backgroundColor, textColor, isFavorite } = req.body;
        const owner = req.user.id;
        const novoQuadro = await Quadro.create({
            titulo,
            backgroundColor,
            textColor,
            isFavorite,
            owner
        });
        return res.status(201).json(novoQuadro);    
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
}

exports.pegarQuadros = async(req, res) =>{
    try
    {
        const quadros = await Quadro.find({ owner: req.user.id });
        res.json(quadros);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor'})
    }
}

exports.atualizarQuadro = async(req, res) =>{
    try{
        const {titulo, backgroundColor, textColor, isFavorite} = req.body;
        const quadroAtualizado = await Quadro.findByIdAndUpdate(
            req.body.id, { titulo, backgroundColor, textColor, isFavorite},
            {new : true}
        );
        return res.json({ message: 'Lista criada com sucesso'});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor'})
    }
}
exports.deletarQuadro = async(req,res) =>{
    try{
        const quadroDelete = await Quadro.findByIdAndDelete(req.body.id);
        if(!quadroDelete){return res.status(404).json({ error: 'Erro ao deletar quadro' });}
        return res.json({ message: 'Quadro deletado com sucesso' }) ;
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
}
exports.adicionarLista = async (id, listaId) => { // Ordem corrigida e nome mais claro
    try {
        const quadro = await Quadro.findById(id);
        if(!quadro){
            throw new Error("Quadro não encontrado")
        }
        quadro.listas.push(listaId)
        const quadroAtualizado = await quadro.save()
        console.log("teste")

        return "Lista adicionada com sucesso";
    } catch (error) {
        console.error('Erro ao adicionar lista ao quadro:', error);
        throw error; // Re-lança o erro para o tratamento superior
    }
};
exports.deletarListaDoQuadro = async (listaId, quadroId) => {
    try {
        const quadroAtualizado = await Quadro.findByIdAndUpdate(
            quadroId,
            { $pull: { listas: listaId } }, // Remove o listaId do array 'listas'
            { new: true } // Retorna o documento atualizado
        ).populate('listas'); // Popula as listas para retornar o objeto completo
        if (!quadroAtualizado) {
            throw new Error('Quadro não encontrado.');
        }

        return quadroAtualizado; // Retorna o quadro atualizado
    } catch (error) {
        console.error('Erro ao deletar lista do quadro:', error);
        throw error; // Re-lança o erro
    }
};
exports.reordenarListasDoQuadro = async(req, res) =>{
    try {
        const novaOrdemListas = req.body.novaOrdemListas;
        const quadroId = req.body.quadroId;
        const quadro = await Quadro.findById(quadroId);
        if (!quadro) {
            throw new Error('Quadro não encontrado.');
        }

        if (!Array.isArray(novaOrdemListas) || novaOrdemListas.length !== quadro.listas.length) {
            throw new Error('Nova ordem de listas inválida. Deve ser um array com o mesmo tamanho do array atual.');
        }

        // Verifica se todos os IDs da nova ordem existem no array original
        const idsOriginais = quadro.listas.map(id => id.toString());
        const novaOrdemIds = novaOrdemListas.map(id => id.toString());

        if(!novaOrdemIds.every(id => idsOriginais.includes(id))){
            throw new Error("A nova ordem contém ids que não existem no quadro")
        }

        const updates = {};
        for (let i = 0; i < novaOrdemListas.length; i++) {
            updates[`listas.${i}`] = novaOrdemListas[i];
        }

        const quadroAtualizado = await Quadro.findByIdAndUpdate(
            quadroId,
            { $set: updates },
            { new: true }
        ).populate('listas');

        return res.status(200).json(quadroAtualizado);
    } catch (error) {
        console.error('Erro ao reordenar listas:', error);
        throw error;
    }
};
exports.resgatarListasDoQuadro = async(quadroId, res) =>{
    const quadro = await Quadro.findById(quadroId);
    if(!quadro){return res.status(500).json({message: "Quadro não existe"})};
    const listas = quadro.listas;
    if(!listas){return res.status(500).json({message: "Erro ao procurar lista"})};
    return listas;
}

