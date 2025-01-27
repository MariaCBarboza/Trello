const mongoose = require('mongoose');
const { Schema } = mongoose; // Importe o Schema desestruturando do mongoose
const Lista = require('./Lista')

const listaSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    cards: [{
        type: Schema.Types.ObjectId, ref: 'Card',
        default: null,
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Lista', listaSchema);