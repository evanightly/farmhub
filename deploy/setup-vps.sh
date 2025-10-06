#!/bin/bash

# VPS Initial Setup Script for E-Catalog Pertanian
# Run this script on your VPS to prepare for GitHub Actions deployment

echo "🚀 Setting up VPS for E-Catalog Pertanian deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages if not already installed
echo "🔧 Installing required packages..."
sudo apt install -y git curl zip unzip software-properties-common

# Create web directory
echo "📁 Setting up project directory..."
sudo mkdir -p /var/www/farmhub
cd /var/www/farmhub

# Clone repository (if not already cloned)
if [ ! -d ".git" ]; then
    echo "📥 Cloning repository..."
    sudo git clone https://github.com/evanightly/farmhub.git .
fi

# Set ownership
echo "🔒 Setting up permissions..."
sudo chown -R $USER:www-data /var/www/farmhub
sudo chmod -R 755 /var/www/farmhub

# Create storage and bootstrap/cache directories
echo "📁 Creating required directories..."
mkdir -p storage/logs
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p bootstrap/cache

# Set proper permissions for Laravel
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Install Composer dependencies
echo "📦 Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

# Install NPM dependencies
echo "📦 Installing NPM dependencies..."
npm ci

# Copy environment file template
echo "⚙️ Setting up environment template..."
cp .env.production.template .env.example.production

echo ""
echo "✅ VPS setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Configure your .env file with production values"
echo "2. Set up GitHub secrets (see README instructions)"
echo "3. Configure Nginx virtual host"
echo "4. Set up SSL certificate"
echo "5. Configure database"
echo ""
echo "🔗 Your project is located at: /var/www/farmhub"