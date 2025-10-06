#!/bin/bash

echo "🔧 Fixing PHP-FPM configuration issue..."

# Restore original PHP-FPM configuration if backup exists
if [ -f "/etc/php/8.3/fpm/pool.d/www.conf.backup."* ]; then
    echo "📦 Restoring original PHP-FPM configuration..."
    BACKUP_FILE=$(ls -t /etc/php/8.3/fpm/pool.d/www.conf.backup.* | head -1)
    sudo cp "$BACKUP_FILE" /etc/php/8.3/fpm/pool.d/www.conf
fi

# Apply the corrected configuration
echo "📝 Applying corrected PHP-FPM configuration..."
sudo cp /var/www/farmhub/deploy/php-fpm-pool.conf /etc/php/8.3/fpm/pool.d/www.conf

# Test PHP-FPM configuration
echo "🧪 Testing PHP-FPM configuration..."
sudo php-fpm8.3 -t

if [ $? -eq 0 ]; then
    echo "✅ PHP-FPM configuration is valid"
    
    # Start PHP-FPM
    echo "🔄 Starting PHP-FPM..."
    sudo systemctl start php8.3-fpm
    
    # Check if it's running
    if sudo systemctl is-active --quiet php8.3-fpm; then
        echo "✅ PHP-FPM started successfully"
        
        # Reload nginx
        echo "🔄 Reloading Nginx..."
        sudo systemctl reload nginx
        
        echo ""
        echo "🎉 All services are now running properly!"
        echo ""
        echo "✅ Status:"
        echo "• PHP-FPM: $(sudo systemctl is-active php8.3-fpm)"
        echo "• Nginx: $(sudo systemctl is-active nginx)"
        echo ""
        echo "🔍 You can now test:"
        echo "• File uploads up to 100MB should work"
        echo "• Page refreshes should not give 502 errors"
        
    else
        echo "❌ PHP-FPM failed to start. Checking status..."
        sudo systemctl status php8.3-fpm
    fi
else
    echo "❌ PHP-FPM configuration test failed!"
    echo "Restoring original configuration..."
    if [ -f "$BACKUP_FILE" ]; then
        sudo cp "$BACKUP_FILE" /etc/php/8.3/fpm/pool.d/www.conf
        sudo systemctl start php8.3-fpm
    fi
    exit 1
fi