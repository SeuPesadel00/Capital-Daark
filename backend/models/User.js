// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true // Remove espaços em branco do início/fim
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Converte para minúsculas antes de salvar
        trim: true,
        match: [/.+@.+\..+/, 'Por favor, insira um e-mail válido'] // Validação básica de email
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Senha mínima de 6 caracteres
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
