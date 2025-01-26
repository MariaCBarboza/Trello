const colecaoSchema = new Schema({
    nome: { 
        type: String, 
        required: true 
    },
    quadros: [{ type: Schema.Types.ObjectId, 
        ref: 'Quadro' 
    }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Colecao', colecaoSchema);
