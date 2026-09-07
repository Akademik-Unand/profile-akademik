# syntax=docker/dockerfile:1
# Satu image: Nginx (frontend static) + Node (backend API)
# Database MySQL TIDAK masuk image/compose — pakai mysql-server di VM.

FROM node:22-bookworm-slim AS frontend-builder
WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
# Relative path agar FE/API/assets ikut skema HTTPS di reverse proxy kampus
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM node:22-bookworm-slim AS backend-deps
WORKDIR /build/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-bookworm-slim
ENV NODE_ENV=production \
    PORT=3000 \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx supervisor curl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && rm -f /etc/nginx/sites-enabled/default

WORKDIR /app

# App di-COPY ke image (bukan volume)
COPY backend /app/backend
COPY --from=backend-deps /build/backend/node_modules /app/backend/node_modules
COPY --from=frontend-builder /build/frontend/dist /app/frontend/dist

# Pastikan .env & uploads tidak ikut image
RUN rm -f /app/backend/.env /app/backend/.env.* \
  && mkdir -p /app/backend/uploads \
  && chown -R www-data:www-data /app/backend/uploads

COPY config/webserver-config.conf /etc/nginx/conf.d/default.conf
COPY src/supervisord.conf /etc/supervisor/conf.d/app.conf
COPY src/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
  && ln -sf /dev/stdout /var/log/nginx/access.log \
  && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://127.0.0.1/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
