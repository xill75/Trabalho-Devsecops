# Etapa 1: Construção do Backend
FROM node:22.11.0 AS backend

WORKDIR /app

# Copiar os arquivos do backend
COPY ./backend /app

# Instalar dependências do backend
RUN npm install

# Etapa 2: Construção do Frontend (Nginx)
FROM nginx:alpine AS frontend

WORKDIR /usr/share/nginx/html

# Remover arquivos existentes do Nginx
RUN rm -rf ./*

# Copiar os arquivos de build do frontend para o Nginx
COPY ./frontend/build /usr/share/nginx/html

# Etapa 3: Combinar Backend e Frontend em um único container
FROM node:22.11.0 AS final

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos do Backend e Frontend
COPY --from=backend /app /app
COPY --from=frontend /usr/share/nginx/html /usr/share/nginx/html

# Expor as portas (backend na 3000 e frontend na 80)
EXPOSE 3000 80

# Rodar os dois processos simultaneamente
CMD ["sh", "-c", "npm start & nginx -g 'daemon off;'"]
