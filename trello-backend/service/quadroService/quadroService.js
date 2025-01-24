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

