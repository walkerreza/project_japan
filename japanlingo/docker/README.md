# JapanLingo Docker Deployment

Setup ini ditujukan untuk VPS production/beta, bukan Laravel Sail development.

## Service

- `app`: Laravel PHP-FPM.
- `nginx`: web server untuk public assets dan proxy PHP.
- `postgres`: PostgreSQL 17.
- `queue`: `php artisan queue:work`.
- `scheduler`: `php artisan schedule:work`.

## First Deploy

1. Copy env template:

```bash
cp .env.docker.example .env.docker
```

2. Isi nilai production:

- `APP_URL`
- `APP_KEY`
- `DB_PASSWORD`
- Google OAuth credentials jika dipakai

Generate `APP_KEY` bisa dilakukan dari local Laravel:

```bash
php artisan key:generate --show
```

3. Build dan start:

```bash
docker compose --env-file .env.docker up -d --build
```

4. Jalankan migration:

```bash
docker compose --env-file .env.docker exec app php artisan migrate --force
```

5. Seed demo hanya jika butuh:

```bash
docker compose --env-file .env.docker exec app php artisan db:seed --force
```

## Update Deploy

```bash
git pull
docker compose --env-file .env.docker up -d --build
docker compose --env-file .env.docker exec app php artisan migrate --force
docker compose --env-file .env.docker exec app php artisan config:cache
docker compose --env-file .env.docker exec app php artisan view:cache
```

## SSL

Compose ini expose HTTP melalui `APP_HTTP_PORT`. Untuk VPS production, pasang reverse proxy di depan container:

- Caddy
- Nginx Proxy Manager
- host Nginx + Certbot

Reverse proxy arahkan domain ke `127.0.0.1:${APP_HTTP_PORT}`.

## Backup PostgreSQL

```bash
docker compose --env-file .env.docker exec postgres pg_dump -U "$DB_USERNAME" "$DB_DATABASE" > backup.sql
```

Jika command di atas tidak membaca variabel shell, gunakan value langsung:

```bash
docker compose --env-file .env.docker exec postgres pg_dump -U japanlingo japanlingo > backup.sql
```

