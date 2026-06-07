#!/usr/bin/env sh
set -e

cd /var/www/html

mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

if [ ! -L public/storage ]; then
    rm -rf public/storage
    ln -s ../storage/app/public public/storage
fi

chown -R www-data:www-data storage bootstrap/cache

php artisan package:discover --ansi --no-interaction || true

if [ "${APP_CACHE_CONFIG:-true}" = "true" ]; then
    php artisan config:cache --no-interaction || true
    php artisan view:cache --no-interaction || true
fi

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    php artisan migrate --force --no-interaction
fi

if [ "${RUN_SEEDERS:-false}" = "true" ]; then
    php artisan db:seed --force --no-interaction
fi

exec "$@"
