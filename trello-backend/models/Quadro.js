const mongoose = require('mongoose');
const { Schema } = mongoose; // Importe o Schema desestruturando do mongoose
const Lista = require('./Lista')

const quadroSchema = new Schema({
    titulo: { 
        type: String, 
        required: true 
    },
    backgroundColor: { 
        type: String 
    },
    textColor: { 
        type: String 
    },
    isFavorite: { type: Boolean, 
        default: false 
    },
    owner: { type: Schema.Types.ObjectId,
         ref: 'User', required: true 
        },
    listas: [{ type: Schema.Types.ObjectId, 
        ref: 'Lista' 
    }],
    compartilhadoCom: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          permissao: { type: String, enum: ['visualizar', 'editar'], default: 'visualizar' },
        },
      ],
});

module.exports = mongoose.model('Quadro', quadroSchema);
