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
        return res.json(quadroAtualizado);
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

