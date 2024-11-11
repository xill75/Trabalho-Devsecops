# Etapa 1: Construção do Backend
FROM node:22.11.0 AS Backend

WORKDIR /app

# Copiar os arquivos do backend
COPY ./Backend/ /app

# Instalar dependências do backend
RUN npm install

# Etapa 2: Configuração do Frontend (Nginx)
FROM nginx:alpine AS Frontend

WORKDIR /usr/share/nginx/html

# Remover arquivos existentes do Nginx
RUN rm -rf ./*

# Copiar os arquivos do frontend diretamente
COPY ./Frontend/ /usr/share/nginx/html

# Etapa 3: Combinar Backend e Frontend em um único container
FROM node:22.11.0 AS Final

# Instala o Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos do Backend e Frontend
COPY --from=Backend /app /app
COPY --from=Frontend /usr/share/nginx/html /usr/share/nginx/html

# Expor as portas
EXPOSE 3000 80

# Comando para iniciar o Nginx e o backend
CMD ["sh", "-c", "nginx -g 'daemon off;' & cd /app && npm start"]
