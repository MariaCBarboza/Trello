import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Remove o prefixo 'Bearer '
    if (!token) {
      return res.status(401).json({ message: 'Token de autorização não encontrado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token
    req.user = decoded; // Adiciona os dados do usuário ao objeto da requisição
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export default authenticateToken;