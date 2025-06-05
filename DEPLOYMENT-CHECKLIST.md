# 🚀 VRC Deployment Checklist

## Pre-Deployment Setup

### 1. Server Preparation
- [ ] VPS/Server với ít nhất 2GB RAM
- [ ] Ubuntu 20.04+ hoặc CentOS 8+
- [ ] Domain name được trỏ về server IP
- [ ] SSH access với key authentication

### 2. Dependencies Installation
- [ ] Node.js 18+ installed
- [ ] pnpm package manager
- [ ] MongoDB 7.0+
- [ ] Docker & Docker Compose (nếu dùng Docker)
- [ ] Nginx web server
- [ ] PM2 process manager (nếu manual deploy)

### 3. SSL Certificate
- [ ] Let's Encrypt certificate installed
- [ ] SSL redirect configured
- [ ] Certificate auto-renewal setup

## Environment Configuration

### 4. Environment Variables
- [ ] `.env` file created từ `.env.production`
- [ ] Database credentials configured
- [ ] Strong secrets generated
- [ ] API keys updated
- [ ] Domain URLs updated

### 5. Security Settings
- [ ] Firewall configured (ports 80, 443, 22)
- [ ] SSH key-only authentication
- [ ] Strong database passwords
- [ ] Fail2ban installed
- [ ] Regular security updates enabled

## Deployment Process

### 6. Choose Deployment Method

#### Option A: Docker Deployment ✅ Recommended
- [ ] `docker-compose.production.yml` configured
- [ ] Environment variables set
- [ ] SSL certificates mounted
- [ ] Services started: `docker-compose -f docker-compose.production.yml up -d`
- [ ] Health checks passed

#### Option B: Manual Deployment
- [ ] Code cloned to `/var/www/vrc`
- [ ] Dependencies installed
- [ ] Applications built
- [ ] PM2 processes started
- [ ] Nginx configured

### 7. Nginx Configuration
- [ ] Reverse proxy setup
- [ ] SSL configuration
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Static file caching

### 8. Database Setup
- [ ] MongoDB service running
- [ ] Database user created
- [ ] Initial data seeded (if needed)
- [ ] Backup strategy implemented

## Post-Deployment Verification

### 9. Health Checks
- [ ] Backend health: `curl https://your-domain.com/api/health`
- [ ] Frontend accessible: `curl https://your-domain.com/`
- [ ] Admin panel: `https://your-domain.com/admin`
- [ ] SSL certificate valid
- [ ] Performance acceptable

### 10. Monitoring Setup
- [ ] `monitor.sh` script scheduled (cron)
- [ ] Log rotation configured
- [ ] Backup script scheduled
- [ ] Alert notifications setup
- [ ] Uptime monitoring

## Maintenance & Operations

### 11. Backup & Recovery
- [ ] Database backup script working
- [ ] Backup retention policy set
- [ ] Backup restoration tested
- [ ] Application backup strategy

### 12. Performance Optimization
- [ ] Gzip compression enabled
- [ ] Image optimization
- [ ] CDN setup (optional)
- [ ] Database indexing
- [ ] Caching strategies

### 13. Documentation
- [ ] Deployment documentation complete
- [ ] Access credentials secured
- [ ] Team access configured
- [ ] Runbook for operations

## Quick Commands Reference

```bash
# Health check
./monitor.sh

# Create backup
./backup.sh

# Deploy updates
./deploy.sh deploy production

# Rollback if needed
./deploy.sh rollback

# Check logs
pm2 logs                    # PM2 logs
docker-compose logs         # Docker logs
tail -f /var/log/nginx/error.log  # Nginx logs

# Service management
pm2 status                  # Check PM2 processes
docker-compose ps           # Check Docker containers
systemctl status nginx     # Check Nginx
systemctl status mongod    # Check MongoDB
```

## Emergency Contacts & Recovery

### Important File Locations
- Application: `/var/www/vrc`
- Logs: `/var/log/`
- Backups: `/backups/vrc`
- SSL Certs: `/etc/nginx/ssl/`
- Nginx Config: `/etc/nginx/sites-available/vrc`

### Recovery Steps
1. **Service Down**: Check `./monitor.sh` output
2. **Database Issues**: Restore from backup using `./backup.sh restore`
3. **Application Issues**: Rollback using `./deploy.sh rollback`
4. **SSL Issues**: Renew certificate with `certbot renew`

### Performance Issues
1. Check resource usage: `./monitor.sh`
2. Review logs for errors
3. Scale resources if needed
4. Optimize database queries

---

✅ **Deployment Complete!** 

Your VRC application should now be running at `https://your-domain.com`

**Next Steps:**
1. Set up monitoring alerts
2. Schedule regular backups
3. Plan update procedures
4. Create team documentation
