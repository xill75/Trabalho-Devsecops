// config.js
require('dotenv').config()
module.exports = {
    DB_HOST: process.env.DB_HOST || 'mysql',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '#FpNsEr64Z2NV&*qDqvU$g*CXD',
    DB_NAME: process.env.DB_NAME || 'malwarezin' 
};
