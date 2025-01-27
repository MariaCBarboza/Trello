const mongoose = require('mongoose');
const { Schema } = mongoose;

const cardSchema = new Schema({
    texto: {
        type: String,
        required: true,
        maxlength: 255,
    },
    listaId: {
        type: Schema.Types.ObjectId,
        ref: 'Lista',
        required: true,
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
    dataAtualizacao: {
        type: Date,
        default: Date.now,
    },
    anexos: [{ type: String }],
}, {
    timestamps: true,
});
module.exports = mongoose.model('Card', cardSchema);
