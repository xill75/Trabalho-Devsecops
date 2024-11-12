const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const malwareRoutes = require('./routes/malwareRoutes');
const userRoutes = require('./routes/usersRoutes');
const path = require('path');
const app = express();
const helmet = require("helmet");
const csurf = require("csurf");


app.use(cors())
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));
app.use(csurf({cookie:true}));

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});


//Rotas
app.use('/api/malware', malwareRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});