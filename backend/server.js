// backend/server.js

require('dotenv').config(); // Carrega variáveis de ambiente do .env

// Essa linha de console.log é para debug. Você pode removê-la após confirmar que a URI está sendo carregada corretamente.
console.log('Valor de MONGODB_URI:', process.env.MONGODB_URI);

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // Importa o módulo CORS

// Importa as rotas de autenticação
const authRoutes = require('./routes/auth'); // Certifique-se que o caminho está correto
// Importa o middleware de autenticação para rotas protegidas (exemplo)
const authMiddleware = require('./middleware/auth'); // Certifique-se que o caminho está correto

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware para processar JSON no corpo das requisições (req.body)
app.use(express.json());

// Servir arquivos estáticos do frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas!'))
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err.message);
        // Opcional: Terminar o processo se não conseguir conectar ao DB
        // process.exit(1);
    });

// ---------------------------------------------------
// Rotas da API
// ---------------------------------------------------

// Rotas de Autenticação (Registro e Login)
// Todas as rotas definidas em auth.js serão prefixadas com /api/auth
app.use('/api/auth', authRoutes); // <--- AQUI ESTÁ A ÚNICA CHAMADA PARA SUAS ROTAS DE AUTENTICAÇÃO

// Exemplo de Rota Protegida
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({
        message: `Bem-vindo, ${req.user.username || req.user.id}! Você acessou uma rota protegida.`,
        userId: req.user.id,
        username: req.user.username
    });
});

// ---------------------------------------------------
// Rotas do Frontend (Fallback para SPA ou páginas específicas)
// ---------------------------------------------------

// Se você quiser que a URL raiz (http://localhost:3000/) sirva um arquivo HTML específico
// que não seja o 'index.html' padrão da pasta 'public', você pode descomentar e ajustar esta rota.
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Inicia o servidor e o faz escutar na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});