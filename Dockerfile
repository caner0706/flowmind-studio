# ------------ Builder stage ------------
FROM node:20-alpine AS builder

WORKDIR /app

# Package dosyaları
COPY package.json package-lock.json* ./

RUN npm install

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
COPY --from=builder /app/next.config.* ./  || true

RUN npm install --omit=dev

# HF Spaces için port
ENV PORT=7860
EXPOSE 7860

# Next.js prod server'ı HF portunda çalıştır
CMD ["npm", "run", "start", "--", "-p", "7860"]
