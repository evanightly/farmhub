# 🚀 Quick Deployment Setup

## Required GitHub Secrets

| Secret           | Value               | Example                             |
| ---------------- | ------------------- | ----------------------------------- |
| `VPS_HOST`       | Your VPS IP/domain  | `192.168.1.100` or `yourdomain.com` |
| `VPS_USERNAME`   | SSH username        | `ubuntu` or `root`                  |
| `VPS_SSH_KEY`    | Private SSH key     | Contents of `~/.ssh/deploy_key`     |
| `VPS_PORT`       | SSH port (optional) | `22`                                |
| `PRODUCTION_ENV` | Full .env content   | See .env.production.template        |

## SSH Key Setup Commands

```bash
# 1. Generate key pair
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/deploy_key

# 2. Copy public key to VPS
ssh-copy-id -i ~/.ssh/deploy_key.pub user@your-vps-ip

# 3. Test connection
ssh -i ~/.ssh/deploy_key user@your-vps-ip
```

## VPS Project Directory

```bash
/var/www/farmhub/
```

## Deployment Triggers

- ✅ Push to `main` branch
- ✅ Manual trigger from GitHub Actions

## What Gets Deployed

1. Git pull latest changes
2. Install/update dependencies
3. Deploy .env file
4. Run migrations
5. Build frontend assets
6. Cache optimization
7. Restart services

## Troubleshooting Quick Commands

```bash
# Check deployment logs
tail -f /var/log/nginx/error.log

# Check Laravel logs
tail -f /var/www/farmhub/storage/logs/laravel.log

# Test nginx config
sudo nginx -t

# Restart services
sudo systemctl restart nginx
sudo systemctl restart php8.3-fpm
```
