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

# Copy composer files first for cache
COPY composer.json composer.lock ./

# Install dependencies without scripts
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Copy the rest of the source code
COPY . .

# Ensure required Laravel dirs exist
RUN mkdir -p /var/www/storage /var/www/bootstrap/cache

# Set permissions & run scripts
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && composer dump-autoload --optimize

# Expose port
EXPOSE 3003

# Run Laravel dev server
CMD php artisan serve --host=0.0.0.0 --port=3003
