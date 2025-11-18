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

# Gerekli dosyaları kopyala
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-env.d.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/postcss.config.js ./
COPY --from=builder /app/store ./store
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/types ./types
COPY --from=builder /app/components ./components
COPY --from=builder /app/app ./app

# Production dependencies yükle
RUN npm install --omit=dev

# HF Spaces için port
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"
EXPOSE 7860

# Next.js prod server'ı çalıştır
CMD ["npx", "next", "start", "-p", "7860", "-H", "0.0.0.0"]
