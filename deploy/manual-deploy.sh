#!/bin/bash

# Manual deployment script for troubleshooting
# This script should be run on your VPS

set -e

echo "🚀 Starting manual deployment..."

# Navigate to project directory
cd /var/www/farmhub || { echo "❌ Project directory not found"; exit 1; }

# Fix git ownership issue
echo "🔧 Fixing git ownership..."
sudo git config --global --add safe.directory /var/www/farmhub

# Check current commit
echo "📋 Current commit:"
git log --oneline -1

# Stash any local changes and force pull
echo "🔄 Pulling latest changes from GitHub..."
git stash --include-untracked || true
git fetch origin main
git reset --hard origin/main
git clean -fd

# Check new commit
echo "📋 New commit:"
git log --oneline -1

# Install/Update Composer dependencies
echo "📦 Installing/Updating Composer dependencies..."
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader

# Install/Update NPM dependencies
echo "📦 Installing/Updating NPM dependencies..."
rm -f package-lock.json
npm install
npm ci

# Clear all caches
echo "🧹 Clearing all caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
php artisan event:clear

# Build frontend assets with verbose output
echo "🏗️ Building frontend assets..."
npm run build

# Cache config and routes for production
echo "⚡ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
echo "🔒 Setting proper permissions..."
sudo chown -R www-data:www-data storage bootstrap/cache public/build
sudo chmod -R 775 storage bootstrap/cache public/build

# Clear OPcache and restart services
echo "🔄 Restarting services..."
sudo systemctl reload nginx
sudo systemctl restart php8.3-fpm

# Verify build files exist
echo "🔍 Verifying build files..."
ls -la public/build/

echo "✅ Manual deployment completed!"
echo "🌐 Application should now be updated!"
echo ""
echo "If the site still doesn't show updates:"
echo "1. Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)"
echo "2. Check browser developer tools for any 404 errors"
echo "3. Verify the manifest.json file is updated"