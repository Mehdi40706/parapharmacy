# ---- Étape dev : hot reload ----
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/parapharmacie_db?schema=public"


RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "start:dev"]

# ---- Étape 1 : build ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Valeur factice — uniquement pour satisfaire la validation au moment du build
# La vraie valeur sera injectée par docker-compose au runtime, pas ici
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"

RUN npx prisma generate
RUN npm run build

# ---- Image finale ----
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000

CMD sh -c 'echo "DB URL starts with: $(echo $DATABASE_URL | cut -c1-20)" && npx prisma migrate deploy && node dist/src/main.js'