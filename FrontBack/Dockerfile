# Etapa 1: Construção do Backend
FROM node:22.11.0 AS backend

WORKDIR /app

# Copiar os arquivos do backend
COPY ./backend/ /app

# Instalar dependências do backend
RUN npm install

# Etapa 2: Construção do Frontend (Nginx)
FROM nginx:alpine AS frontend

WORKDIR /usr/share/nginx/html

# Remover arquivos existentes do Nginx
RUN rm -rf ./*

# Copiar os arquivos de build do frontend para o Nginx
COPY ./frontend/build /usr/share/nginx/html

# Etapa 3: Combinar Backend e Frontend em um único container com supervisord
FROM node:22.11.0 AS final

# Instala o supervisor
RUN apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos do Backend e Frontend
COPY --from=backend /app /app
COPY --from=frontend /usr/share/nginx/html /usr/share/nginx/html

# Copiar o arquivo de configuração do supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expor as portas
EXPOSE 3000 80

# Executa o supervisord para iniciar ambos os serviços
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

