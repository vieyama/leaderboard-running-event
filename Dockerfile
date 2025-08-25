FROM php:8.2-cli

# Install system dependencies & Node.js
RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy only composer files first for better layer caching
COPY composer.json composer.lock ./

# Install Laravel dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Copy all source files
COPY . .

# Re-run scripts after full copy (like Laravel post-autoload scripts)
RUN composer dump-autoload && \
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Laravel port
EXPOSE 3003

# Run Laravel dev server
CMD php artisan serve --host=0.0.0.0 --port=3003
