// src/controllers/userController.js
import User from '../models/User.js';

// Pegar perfil do usu�rio
export async function getUserProfile(req, res) {
    console.log("Fetching user profile");
    try {
        const user = await User.findById(req.user.id); // Supondo que req.user.id est� dispon�vel atrav�s do middleware de autentica��o
        if (!user) {
            return res.status(404).send('Usu�rio n�o encontrado');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar os dados do usu�rio', error: error.message });
    }
}

// Atualizar perfil do usu�rio
export async function updateUserProfile(req, res) {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        if (!user) {
            return res.status(404).send('Usu�rio n�o encontrado');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar os dados do usu�rio', error: error.message });
    }
}
export async function getUserByEmail(req, res) {
        try {
            const email = req.params;
            console.log(email)
            const user = await User.findOne({email: email.email});
            if (!user) {
                return res.status(404).send('Usuário não encontrado');
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao coletar usuario', error: error.message });
        }

    }

