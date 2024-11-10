#!/bin/sh

# Iniciar o backend
cd /app/backend
npm start &

# Iniciar o Nginx (para servir o frontend)
nginx -g 'daemon off;'
