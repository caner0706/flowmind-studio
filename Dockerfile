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

# Sadece ihtiyaç duyulan dosyalar
COPY --from=builder /app/package.json package-lock.json* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

RUN npm install --omit=dev

# HF Spaces için port
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"
EXPOSE 7860

# Next.js prod server'ı HF portunda çalıştır
# PORT ve HOSTNAME environment variable'larını kullan
CMD ["sh", "-c", "npm run start -- -p ${PORT:-7860} -H ${HOSTNAME:-0.0.0.0}"]
