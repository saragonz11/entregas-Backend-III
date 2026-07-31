# =========================
# Etapa 1: dependencias
# =========================
FROM node:20.11.0-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

# Solo dependencias de producción (imagen más liviana y reproducible)
RUN npm ci --omit=dev

# =========================
# Etapa 2: ejecución
# =========================
FROM node:20.11.0-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copiar dependencias instaladas desde la etapa anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar código fuente y definición de paquetes
COPY package*.json ./
COPY ./src ./src

EXPOSE 8080

CMD ["npm", "start"]
