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
FROM nginx:alpine AS Final

# Instalar Node.js e npm usando o apk
RUN apk update && apk add --no-cache nodejs npm

# Copiar os arquivos do Backend e Frontend
COPY --from=Backend /app /app
COPY --from=Frontend /usr/share/nginx/html /usr/share/nginx/html

# Expor as portas corretas
EXPOSE 80 3000

# Instalar dependências do backend
WORKDIR /app
RUN npm install

# Copiar o script de inicialização
COPY ./start.sh /start.sh
RUN chmod +x /start.sh

# Comando para iniciar o Nginx e o backend
CMD ["/start.sh"]
