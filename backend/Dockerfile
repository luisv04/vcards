FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar código fuente
COPY . .

# Crear directorios necesarios
RUN mkdir -p uploads qr-codes

# Exponer puerto
EXPOSE 3000

# Usuario no root por seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Comando de inicio
CMD ["npm", "start"] 