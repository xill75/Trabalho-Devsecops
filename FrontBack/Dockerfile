# Etapa 1: Construção do Backend
FROM node:22.11.0 AS Backend

WORKDIR /app

# Copiar os arquivos do backend
COPY ./Backend/ /app

# Instalar dependências do backend
RUN npm install

# Etapa 2: Construção do Frontend (Nginx)
FROM nginx:alpine AS Frontend

WORKDIR /usr/share/nginx/html

# Remover arquivos existentes do Nginx
RUN rm -rf ./*

# Copiar os arquivos do frontend para o Nginx
COPY ./Frontend/ /usr/share/nginx/html

# Etapa 3: Combinar Backend e Frontend em um único container com supervisord
FROM node:22.11.0 AS Final

# Instala o supervisor e o Nginx
RUN apt-get update && apt-get install -y supervisor nginx && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos do Backend e Frontend
COPY --from=Backend /app /app
COPY --from=Frontend /usr/share/nginx/html /usr/share/nginx/html

# Copiar o arquivo de configuração do supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expor as portas
EXPOSE 3000 80

# Executa o supervisord para iniciar ambos os serviços
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
