const mongoose = require('mongoose');
const { Schema } = mongoose; // Importe o Schema desestruturando do mongoose

const cardSchema = new Schema({
    texto: {
        type: String,
        required: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
    dataAtualizacao: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);