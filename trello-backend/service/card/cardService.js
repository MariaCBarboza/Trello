const Card = require("../../models/Card");
const router = require("../../routes/authRoutes");
const listaService = require('../lista/listaService')

exports.criarCard = async(req,res) =>{
    try{
        const {texto} = req.body;
        const card = new Card({
            texto
        });
        await card.save();
        listaService.adicionarCard( req.body.listaId, card.id)
        return res.status(200).json({ message: "Card adicionado com sucesso"})
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
}