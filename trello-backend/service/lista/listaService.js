const Lista = require("../../models/Lista");
const router = require("../../routes/authRoutes");
const quadroService = require("../quadro/quadroService");

exports.criarLista = async(req,res) =>{
    try{
        const {titulo} = req.body;
        const novaLista = new Lista({
            titulo
        });
        await novaLista.save();
        quadroService.adicionarLista( req.body.id, novaLista.id)
        return res.status(200).json({ message: "Lista adicionada com sucesso"})
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
}
exports.alterarTitulo = async(req,res) =>{
    try{
        const {titulo} = req.body;
        const listaAtualizada = await Lista.findByIdAndUpdate(
            req.body.id, {titulo}, {new: true}
        );
        if(!listaAtualizada){ return res.status(500).json({ message: 'Lista não encontrada'})}
        return res.status(200).json({ message: 'Lista alterada com sucesso'});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
}
exports.deletarLista = async(req,res) =>{
    try{
        const listaId = req.body.listaId;
        const quadroId = req.body.quadroId;
        const deletarListaDoQuadro = await quadroService.deletarListaDoQuadro(listaId, quadroId);
        const listaDeletada = await Lista.findByIdAndDelete(listaId);
        if(!listaDeletada){ return res.status(500).json({ message: 'Lista não encontrada' })}
        
        return res.status(200).json({ message: 'Lista deletada' });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
}
exports.buscarListas = async(req,res) =>{
    try
    {
        const listas = await quadroService.resgatarListasDoQuadro(req.body.quadroId);
        res.json(listas);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor'})
    }
}