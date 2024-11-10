const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const malwareRoutes = require('./routes/malwareRoutes');
const userRoutes = require('./routes/usersRoutes');
const path = require('path');
const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));
app.use(cors())

//Rotas
app.use('/api/malware', malwareRoutes);
app.use('/api/users', userRoutes);

// Middleware 404 pagina de erro
//app.use((req, res, next) => {
//    res.status(404).sendFile(path.join(__dirname, '../frontend/pages/error.html'), (err) => {
//        if (err) {
//            console.error("Erro ao enviar a página de erro:", err);
//            next(err);  
//        }
//    });
//});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});