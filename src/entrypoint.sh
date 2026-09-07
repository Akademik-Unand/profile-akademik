#!/bin/sh
set -eu

echo "[entrypoint] Profile Akademik — starting container"

UPLOAD_DIR="${UPLOAD_DIR:-/app/backend/uploads}"
mkdir -p "$UPLOAD_DIR"
chmod -R u+rwX,g+rwX "$UPLOAD_DIR" || true

if [ ! -f /app/backend/.env ]; then
  echo "[entrypoint] WARNING: /app/backend/.env tidak ditemukan."
  echo "[entrypoint] Mount ./config/.env ke /app/backend/.env (lihat docker-compose.yml)."
fi

# Pastikan folder dist frontend ada (hasil COPY saat build)
if [ ! -d /app/frontend/dist ]; then
  echo "[entrypoint] ERROR: /app/frontend/dist tidak ada. Image build gagal?"
  exit 1
fi

echo "[entrypoint] Menjalankan supervisord (nginx + node)"
exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
