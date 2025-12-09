# Multi-stage build for Conbyt application
FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

RUN rm -rf node_modules/.vite .vite dist

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

COPY server/ ./server/
COPY --from=frontend-builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 8080

ENV NODE_ENV=production
# Don't force PORT, Railway will set it:
# ENV PORT=8080   <-- remove this

WORKDIR /app/server
CMD ["node", "server.js"]
