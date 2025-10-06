#!/bin/bash

# Nginx and PHP-FPM Diagnostic Script
echo "🔍 Diagnosing Nginx and PHP-FPM issues..."
echo "=================================================="

# Check if services are running
echo "📊 Service Status:"
echo "-------------------"
sudo systemctl is-active nginx && echo "✅ Nginx is running" || echo "❌ Nginx is not running"
sudo systemctl is-active php8.3-fpm && echo "✅ PHP-FPM is running" || echo "❌ PHP-FPM is not running"
echo ""

# Check nginx configuration
echo "🔧 Nginx Configuration Test:"
echo "-----------------------------"
sudo nginx -t
echo ""

# Check current upload limits
echo "📁 Current Upload Limits:"
echo "-------------------------"
echo "Nginx client_max_body_size:"
grep -r "client_max_body_size" /etc/nginx/ 2>/dev/null || echo "Not configured (default: 1M)"
echo ""
echo "PHP upload_max_filesize:"
php -i | grep upload_max_filesize || echo "Not found"
echo ""
echo "PHP post_max_size:"
php -i | grep post_max_size || echo "Not found"
echo ""

# Check nginx error logs
echo "📝 Recent Nginx Error Logs:"
echo "----------------------------"
sudo tail -n 20 /var/log/nginx/error.log 2>/dev/null || echo "No error log found"
echo ""

# Check PHP-FPM error logs
echo "📝 Recent PHP-FPM Error Logs:"
echo "------------------------------"
sudo tail -n 20 /var/log/php8.3-fpm.log 2>/dev/null || echo "No PHP-FPM log found"
echo ""

# Check if socket exists and permissions
echo "🔌 PHP-FPM Socket Status:"
echo "--------------------------"
ls -la /var/run/php/php8.3-fpm.sock 2>/dev/null && echo "✅ Socket exists" || echo "❌ Socket not found"
echo ""

# Check disk space
echo "💾 Disk Space:"
echo "--------------"
df -h /var/www/farmhub
echo ""

# Check project permissions
echo "🔒 Project Permissions:"
echo "-----------------------"
ls -la /var/www/farmhub/ | head -10
echo ""

echo "=================================================="
echo "🎯 Quick Fixes:"
echo "1. Run: sudo bash /var/www/farmhub/deploy/fix-nginx-errors.sh"
echo "2. If still issues, restart both services:"
echo "   sudo systemctl restart nginx php8.3-fpm"
echo "3. Check logs for specific errors"