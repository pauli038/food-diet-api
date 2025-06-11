# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

# Copiar archivos de dependencias y config
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar ncias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Construir la app (generará dist/)
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Aquí es donde deben ir los ARG y ENV
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_DIALECT
ARG GEMINI_API_KEY

ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV DB_DIALECT=${DB_DIALECT}
ENV GEMINI_API_KEY=${GEMINI_API_KEY}

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]