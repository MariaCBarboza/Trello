const mongoose = require('mongoose');
const { Schema } = mongoose; // Importe o Schema desestruturando do mongoose

const listaSchema = new Schema({
    texto: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Lista', listaSchema);