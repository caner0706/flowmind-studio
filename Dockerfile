# ------------ Builder stage ------------
FROM node:20-alpine AS builder

WORKDIR /app

# Package dosyaları
COPY package.json package-lock.json* ./

RUN npm install

# public klasörü yoksa bile oluştur (HF build'te kopyalama hatası olmasın)
RUN mkdir -p public

# Tüm kodu kopyala
COPY . .

# Production build
RUN npm run build

# ------------ Runner stage ------------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Next.js standalone output kullan
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# HF Spaces için port
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"
EXPOSE 7860

# Next.js standalone server'ı çalıştır
CMD ["node", "server.js"]
