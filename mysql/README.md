# Dump MySQL untuk deploy Unand

MySQL **tidak** dijalankan di Docker. Dump diletakkan di folder ini agar ikut paket `project-dev`.

## Export dari mesin development

```bash
mysqldump -u root -p --databases profile_akademik --routines --triggers --single-transaction > mysql/profile_akademik.sql
```

Atau terkompresi:

```bash
mysqldump -u root -p --databases profile_akademik --routines --triggers --single-transaction | gzip > mysql/profile_akademik.sql.gz
```

## Import di VM kampus (mysql-server host)

```bash
mysql -u root -p < mysql/profile_akademik.sql
# atau
gunzip -c mysql/profile_akademik.sql.gz | mysql -u root -p
```

Setelah import, sesuaikan `config/.env` (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`).

Jalankan migrasi dari dalam container jika perlu:

```bash
docker exec -it profile-akademik sh -c "cd /app/backend && npx sequelize-cli db:migrate"
docker exec -it profile-akademik sh -c "cd /app/backend && npx sequelize-cli db:seed:all"
```
