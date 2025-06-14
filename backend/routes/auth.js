// routes/auth.js
const express = require('express');
const router = express.Router(); // <<< --- ADICIONE/VERIFIQUE ESTA LINHA
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importa o modelo de usuário

// @route   POST /api/auth/register
// @desc    Registrar um novo usuário
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Verificar se o usuário/email já existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Usuário com este e-mail já existe.' });
        }
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Nome de usuário já existe.' });
        }

        // 2. Criar uma nova instância de usuário
        user = new User({ username, email, password });

        // 3. Hashear a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Salvar o usuário no banco de dados
        await user.save();

        // 5. Gerar um token JWT para o novo usuário (autologin após registro)
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ message: 'Registro bem-sucedido!', token, username: user.username });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor.');
    }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuário e obter token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // ADICIONADO: console.log para depuração (MANTENHA ESTE)
    console.log('Requisição de Login recebida:', { email, password }); 

    try {
        // 1. Verificar se o usuário existe pelo email
        let user = await User.findOne({ email });
        // ADICIONADO: console.log para depuração (MANTENHA ESTE)
        console.log('Usuário encontrado pelo email:', user ? user.email : 'Nenhum'); 
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // 2. Comparar a senha fornecida com a senha hasheada no DB
        const isMatch = await bcrypt.compare(password, user.password);
        // ADICIONADO: console.log para depuração (MANTENHA ESTE)
        console.log('Resultado da comparação de senha (isMatch):', isMatch); 
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Gerar um token JWT
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ message: 'Login bem-sucedido!', token, username: user.username });
            }
        );

    } catch (err) {
        console.error('Erro no login do backend:', err.message);
        res.status(500).send('Erro no servidor.');
    }
});

module.exports = router; // Certifique-se que você está exportando o router