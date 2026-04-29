FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY server.js db.js models.js migration.js ./
COPY routes/ ./routes/

EXPOSE 3001

CMD ["node", "server.js"]
