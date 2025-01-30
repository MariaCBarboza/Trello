
import Collection from '../../models/Colecao.js';

export async function getUserCollections(userId) {
    return Collection.find({ owner: userId }).populate('boards');
}

export async function createCollection(data, userId) {
    const newCollection = new Collection({
        name: data.name,
        owner: userId,
        boards: data.boards || [],
    });
    return newCollection.save();
}

export async function deleteCollection(collectionId) {
    return Collection.findByIdAndDelete(collectionId);
}

// Função para atualizar a coleção
export async function updateCollection(collectionId, data) {
    return Collection.findByIdAndUpdate(
        collectionId,
        {
            name: data.name,
            boards: data.boards || [],
        },
        { new: true } // Retorna a coleção atualizada
    );
}
