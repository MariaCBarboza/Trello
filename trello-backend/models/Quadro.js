const mongoose = require('mongoose');
const { Schema } = mongoose; // Importe o Schema desestruturando do mongoose
const Lista = require('./Lista')

const quadroSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    backgroundColor: {
        type: String,
        default: '#ffffff'
    },
    textColor: {
        type: String,
        default: '#000000'
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId, // Agora funciona corretamente
        ref: 'User',
        required: true
    },
    listas: [{
        type: Schema.Types.ObjectId, ref: 'Lista',
        default: null,
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Quadro', quadroSchema);
