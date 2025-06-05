# VRC Project Quick Start Guide

## 🚀 Quick Development Setup

### Prerequisites
- Node.js >= 18.20.2
- pnpm >= 9
- MongoDB >= 4.4

### 1. Clone and Install
```bash
git clone <your-repo-url> vrc
cd vrc

# Backend
cd backend
pnpm install

# Frontend
cd ../vrcfrontend
npm install
```

### 2. Environment Setup
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your values

# Frontend
cd ../vrcfrontend
cp .env.example .env
# Edit .env with your values
```

### 3. Start Development
```bash
# Terminal 1: Backend
cd backend
pnpm dev

# Terminal 2: Frontend
cd vrcfrontend
npm run dev
```

### 4. Access Applications
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:3000/api
- **Admin Panel**: http://localhost:3000/admin

---

## 🏭 Production Deployment Options

### Option 1: Docker (Recommended)
```bash
# 1. Prepare environment
cp .env.production .env
# Edit .env with production values

# 2. Deploy with Docker
docker-compose -f docker-compose.production.yml up -d

# 3. Check status
docker-compose -f docker-compose.production.yml ps
```

### Option 2: Manual VPS Deployment
```bash
# 1. Install dependencies
./deploy.sh

# 2. Configure Nginx
sudo cp nginx/vrc.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/vrc /etc/nginx/sites-enabled/

# 3. SSL Setup
sudo certbot --nginx -d your-domain.com

# 4. Start services
pm2 start ecosystem.config.js --env production
```

---

## 🛠️ Maintenance Commands

### Backup Database
```bash
./backup.sh                    # Create backup
./backup.sh list              # List backups
./backup.sh restore <file>    # Restore backup
```

### Monitor System
```bash
./monitor.sh                  # Check system health
pm2 status                    # Check processes
docker-compose ps             # Check containers
```

### Update Application
```bash
./deploy.sh deploy production  # Full deployment
./deploy.sh rollback          # Rollback to previous version
```

---

## 📊 Key Endpoints

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/pages` - Get pages
- `GET /api/services` - Get services
- `GET /api/projects` - Get projects
- `POST /api/form-submissions` - Submit forms

### Admin Panel
- `/admin` - Admin dashboard
- `/admin/collections/pages` - Manage pages
- `/admin/collections/services` - Manage services
- `/admin/collections/projects` - Manage projects

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `backend/.env` | Backend environment variables |
| `vrcfrontend/.env` | Frontend environment variables |
| `nginx/nginx.conf` | Nginx reverse proxy config |
| `ecosystem.config.js` | PM2 process management |
| `docker-compose.production.yml` | Docker production setup |

---

## 📝 Troubleshooting

### Common Issues

**Port already in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**MongoDB connection failed:**
```bash
sudo systemctl restart mongod
```

**Nginx configuration error:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**PM2 process issues:**
```bash
pm2 restart all
pm2 logs
```

### Logs Location
- Application: `/var/log/pm2/`
- Nginx: `/var/log/nginx/`
- System: `journalctl -u nginx`

---

## 🔒 Security Checklist

- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Strong database passwords
- [ ] Environment secrets secured
- [ ] Nginx security headers enabled
- [ ] Rate limiting configured
- [ ] Regular backups scheduled

---

## 📈 Performance Tips

1. **Enable gzip compression** in Nginx
2. **Use CDN** for static assets
3. **Optimize images** before upload
4. **Monitor resource usage** with monitoring script
5. **Implement caching** for API responses
6. **Database indexing** for better queries

---

## 📞 Support

For deployment issues or questions, check:
1. Application logs: `pm2 logs`
2. System health: `./monitor.sh`
3. Database status: `mongosh --eval "db.stats()"`
4. Full documentation: `/docs/deployment-guide.md`
