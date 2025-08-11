// middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT
const auth = (req, res, next) => {
    // Tenta obter o token do cabeçalho 'x-auth-token'
    const token = req.header('x-auth-token');

    // Verifica se o token existe
    if (!token) {
        return res.status(401).json({ message: 'Nenhum token, autorização negada.' });
    }

    try {
        // Verifica e decodifica o token usando o segredo JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adiciona o usuário decodificado ao objeto de requisição (req.user)
        // Assim, as rotas protegidas podem acessar o ID do usuário, etc.
        req.user = decoded.user;
        next(); // Continua para a próxima função middleware/rota
    } catch (err) {
        // Se o token for inválido
        res.status(401).json({ message: 'Token não é válido.' });
    }
};

module.exports = auth;