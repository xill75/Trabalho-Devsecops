#!/bin/sh

# Iniciar o Nginx em segundo plano
nginx -g 'daemon off;' &

# Iniciar o backend do Node.js
cd /app
npm start
