const express = require('express');
const router = express.Router();
const db = require('../database/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rota para registrar um usuário
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Verificar se o e-mail já existe
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).send({ message: 'Erro no servidor' });
        if (results.length > 0) {
            return res.status(409).send({ message: 'E-mail já está em uso.' });
        }

        
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).send({ message: 'Erro ao processar a senha' });

            // Inserir o usuário com a senha hashed
            db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
                if (err) return res.status(500).send({ message: 'Erro ao registrar usuário' });
                res.status(201).send({ id: result.insertId, email });
            });
        });
    });
});

// Rota para login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const JWT_SECRET = 'xillcapeta';

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).send({ message: 'Erro no servidor' });
        if (results.length > 0) {
            const user = results[0];

            // Verifica a senha com bcrypt
            bcrypt.compare(password, user.password, (err, match) => {
                if (err) return res.status(500).send({ message: 'Erro ao processar a senha' });
                if (match) {
                    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' })
                    return res.send({ message: 'Login bem-sucedido', token });
                } else {
                    return res.status(401).send({ message: 'Credenciais inválidas' });
                }
            });
        } else {
            return res.status(404).send({ message: 'Email não encontrado' });
        }
    });
});

// rota pra verificar token
router.post('/verificartoken', (req, res) => {

    const JWT_SECRET = 'xillcapeta';
    const token = req.body.token; // Recebe o token no corpo da requisição

    if (!token) {
        return res.status(400).send({ message: 'Token não fornecido' });
    }

    // Verifica a validade do token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Token inválido ou expirado' });
        }
        
        // Token válido, retorna as informações do usuário ou qualquer outra coisa necessária
        res.status(200).send({ message: 'Token válido', user: decoded });
    });
});

module.exports = router;
