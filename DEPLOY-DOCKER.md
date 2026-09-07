# Deploy Docker — Profile Akademik (ketentuan Unand)

Struktur ini menyesuaikan paket `project-dev` kampus:

```text
profile-akademik/          # = /home/docker/profile-akademik di VM
├── backend/               # kode BE (di-COPY ke image saat build)
├── frontend/              # kode FE (di-build & COPY ke image)
├── Dockerfile
├── docker-compose.yml     # HANYA 1 service web (FE+BE+Nginx) — tanpa MySQL
├── src/
│   ├── entrypoint.sh
│   └── supervisord.conf
├── config/
│   ├── .env               # buat dari .env.example (TIDAK masuk image)
│   ├── .env.example
│   ├── php.ini            # placeholder (proyek Node, tidak dipakai)
│   └── webserver-config.conf
├── data/
│   └── uploads/           # volume writable (TIDAK masuk image)
└── mysql/
    └── profile_akademik.sql   # dump DB (MySQL di host VM)
```

## Prinsip penting

| Item | Di image? | Di volume host? |
|------|-----------|-----------------|
| Kode FE/BE | Ya (COPY saat build) | Tidak |
| `.env` | Tidak | Ya (`config/.env`) |
| Upload file | Tidak | Ya (`data/uploads`) |
| Nginx config | Bisa di image + override volume | Ya |
| MySQL | Tidak | mysql-server di VM |

API/assets memakai path relatif (`/api/v1`, `/uploads`) sehingga di belakang HTTPS proxy kampus semuanya tetap **https**.

## 1. Siapkan environment

```bash
cp config/.env.example config/.env
# edit DB_HOST, DB_USER, DB_PASS, FRONTEND_ORIGIN, PUBLIC_UPLOAD_URL, JWT_SECRET
```

Contoh `DB_HOST`:

- `host.docker.internal` (sudah di-map di compose)
- atau IP gateway Docker di Linux (sering `172.17.0.1`)
- atau IP/hostname mysql-server VM jika beda host

Pastikan MySQL di VM mengizinkan koneksi dari Docker bridge (bind-address / user host `%` atau IP container).

## 2. Dump & restore database

Lihat `mysql/README.md`. Letakkan dump di folder `mysql/`.

## 3. Build & jalankan

```bash
docker compose up -d --build
docker logs -f profile-akademik
```

Cek lokal:

- Frontend: http://localhost:8080
- Health: http://localhost:8080/health
- API: http://localhost:8080/api/v1/...

Kalau gagal:

```bash
docker ps -a
docker logs profile-akademik
docker exec -it profile-akademik sh
```

Migrasi (setelah DB siap):

```bash
docker exec -it profile-akademik sh -c "cd /app/backend && npx sequelize-cli db:migrate"
docker exec -it profile-akademik sh -c "cd /app/backend && npx sequelize-cli db:seed:all"
```

## 4. Tag & push ke registry Unand

```bash
docker tag profile-akademik:v1 docker-registry.unand.ac.id:8888/profile-akademik:v1
docker tag profile-akademik:v1 docker-registry.unand.ac.id:8888/profile-akademik

docker push docker-registry.unand.ac.id:8888/profile-akademik:v1
docker push docker-registry.unand.ac.id:8888/profile-akademik
```

**Catatan:** sisi production tidak mendapat notifikasi otomatis setelah push — hubungi admin jaringan/kampus secara manual.

## 5. HTTPS production

Di `config/.env` production:

```env
FRONTEND_ORIGIN=https://nama-domain.unand.ac.id
PUBLIC_UPLOAD_URL=https://nama-domain.unand.ac.id/uploads
```

Frontend di-build dengan `VITE_API_BASE_URL=/api/v1` (sama origin), jadi request API/assets ikut HTTPS dari domain publik.
