#!/bin/bash

# Fix Nginx 502 and 413 errors
echo "🔧 Fixing Nginx configuration issues..."

# Backup current configurations
echo "📦 Creating backups..."
sudo cp /etc/nginx/sites-enabled/farmhub /etc/nginx/sites-enabled/farmhub.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
sudo cp /etc/php/8.3/fpm/pool.d/www.conf /etc/php/8.3/fpm/pool.d/www.conf.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Copy new nginx site configuration
echo "📝 Updating Nginx site configuration..."
sudo cp /var/www/farmhub/deploy/nginx-site.conf /etc/nginx/sites-available/farmhub

# Enable the site (if not already enabled)
sudo ln -sf /etc/nginx/sites-available/farmhub /etc/nginx/sites-enabled/farmhub

# Copy PHP-FPM pool configuration
echo "📝 Updating PHP-FPM configuration..."
sudo cp /var/www/farmhub/deploy/php-fpm-pool.conf /etc/php/8.3/fpm/pool.d/www.conf

# Test nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Restart services
    echo "🔄 Restarting services..."
    sudo systemctl restart php8.3-fpm
    sudo systemctl restart nginx
    
    echo "✅ Services restarted successfully"
    echo ""
    echo "🎉 Configuration fixes applied!"
    echo ""
    echo "📋 Changes made:"
    echo "• Increased client_max_body_size to 100MB (fixes 413 error)"
    echo "• Added proper FastCGI timeouts and buffers (fixes 502 error)"
    echo "• Updated PHP-FPM settings for better performance"
    echo "• Added security headers and caching rules"
    echo ""
    echo "🔍 You can now:"
    echo "• Upload files up to 100MB"
    echo "• Refresh pages without 502 errors"
    echo "• Experience better performance"
    
else
    echo "❌ Nginx configuration test failed!"
    echo "Please check the configuration and try again."
    exit 1
fi