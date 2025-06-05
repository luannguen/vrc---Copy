# Tài Liệu Triển Khai Dự Án VRC

## Tổng Quan Dự Án

**VRC** là dự án fullstack bao gồm:
- **Backend**: Next.js + PayloadCMS (CMS headless) + MongoDB
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + ShadCN UI
- **Database**: MongoDB
- **Architecture**: API-first, Multi-language support, Modern UI/UX

## Cấu Trúc Dự Án

```
vrc/
├── backend/          # Next.js + PayloadCMS Backend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
├── vrcfrontend/      # React + Vite Frontend  
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
└── docs/            # Documentation
```

## Yêu Cầu Hệ Thống

### Development Environment
- **Node.js**: >= 18.20.2 hoặc >= 20.9.0
- **pnpm**: ^9 hoặc ^10 (package manager được khuyến nghị)
- **MongoDB**: >= 4.4 (local hoặc cloud)

### Production Environment
- **Server**: VPS/Dedicated Server với ít nhất 2GB RAM
- **OS**: Linux (Ubuntu 20.04+ hoặc CentOS 8+)
- **Docker**: >= 20.10 (khuyến nghị)
- **Docker Compose**: >= 2.0
- **Web Server**: Nginx (reverse proxy)
- **SSL**: Let's Encrypt hoặc SSL certificate

## 1. Triển Khai Development

### Bước 1: Cài Đặt Dependencies

```bash
# Backend
cd backend
pnpm install

# Frontend  
cd ../vrcfrontend
npm install
```

### Bước 2: Cấu Hình Environment Variables

**Backend (.env):**
```bash
# Copy và cấu hình
cp .env.example .env

# Cấu hình các biến môi trường
PREVIEW_SECRET=your-preview-secret-here
CRON_SECRET=your-cron-secret-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_SECRET=your-32-character-secret-key
DATABASE_URI=mongodb://localhost:27017/vrcpayload
```

**Frontend (.env):**
```bash
# Copy và cấu hình
cp .env.example .env

# Cấu hình
VITE_API_URL=http://localhost:3000
VITE_PUBLIC_API_KEY=vrc-api-2024-secure
VITE_FRONTEND_PORT=8081
VITE_NODE_ENV=development
```

### Bước 3: Khởi Động Services

```bash
# Terminal 1: Backend
cd backend
pnpm dev    # Chạy trên port 3000

# Terminal 2: Frontend  
cd vrcfrontend
npm run dev # Chạy trên port 8081
```

## 2. Triển Khai Production

### Option 1: Docker Deployment (Khuyến nghị)

#### Bước 1: Chuẩn Bị Docker Files

**Tạo docker-compose.production.yml:**
```yaml
version: '3.8'

services:
  # MongoDB Database
  mongo:
    image: mongo:7.0
    container_name: vrc-mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: vrcadmin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: vrcpayload
    volumes:
      - mongo_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    ports:
      - "27017:27017"
    networks:
      - vrc-network

  # Backend Service
  vrc-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: vrc-backend
    restart: always
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_SERVER_URL: ${BACKEND_URL}
      DATABASE_URI: mongodb://vrcadmin:${MONGO_PASSWORD}@mongo:27017/vrcpayload?authSource=admin
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      PREVIEW_SECRET: ${PREVIEW_SECRET}
      CRON_SECRET: ${CRON_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      - mongo
    volumes:
      - backend_uploads:/app/media
    networks:
      - vrc-network

  # Frontend Service  
  vrc-frontend:
    build:
      context: ./vrcfrontend
      dockerfile: Dockerfile
    container_name: vrc-frontend
    restart: always
    environment:
      VITE_API_URL: ${BACKEND_URL}
      VITE_PUBLIC_API_KEY: ${API_KEY}
      VITE_NODE_ENV: production
    ports:
      - "8080:80"
    depends_on:
      - vrc-backend
    networks:
      - vrc-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: vrc-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - nginx_logs:/var/log/nginx
    depends_on:
      - vrc-backend
      - vrc-frontend
    networks:
      - vrc-network

volumes:
  mongo_data:
  backend_uploads:
  nginx_logs:

networks:
  vrc-network:
    driver: bridge
```

#### Bước 2: Tạo Dockerfile cho Frontend

**vrcfrontend/Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**vrcfrontend/nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Bước 3: Cấu Hình Nginx Reverse Proxy

**nginx/nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server vrc-backend:3000;
    }
    
    upstream frontend {
        server vrc-frontend:80;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;

        # API Proxy
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        # Admin Panel Proxy  
        location /admin/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Media/Upload Files
        location /media/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            expires 7d;
            add_header Cache-Control "public, max-age=604800";
        }

        # Frontend Application
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

#### Bước 4: Environment Variables cho Production

**.env.production:**
```bash
# Database
MONGO_PASSWORD=your-strong-mongo-password

# Backend URLs
BACKEND_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

# API Security
API_KEY=your-production-api-key
PAYLOAD_SECRET=your-32-character-production-secret
PREVIEW_SECRET=your-preview-secret
CRON_SECRET=your-cron-secret

# SSL (if using Let's Encrypt)
SSL_EMAIL=your-email@domain.com
```

#### Bước 5: Deploy Commands

```bash
# 1. Clone project to server
git clone <your-repo-url> /var/www/vrc
cd /var/www/vrc

# 2. Copy environment file
cp .env.production .env

# 3. Create SSL certificates (Let's Encrypt)
sudo apt update
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# 4. Copy SSL certificates
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/

# 5. Build and start services
docker-compose -f docker-compose.production.yml up --build -d

# 6. Check status
docker-compose -f docker-compose.production.yml ps
```

### Option 2: Manual Deployment (VPS/Dedicated Server)

#### Bước 1: Cài Đặt Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### Bước 2: Cấu Hình MongoDB

```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database user
mongo
> use admin
> db.createUser({
    user: "vrcadmin",
    pwd: "your-password",
    roles: [{role: "readWrite", db: "vrcpayload"}]
  })
> exit
```

#### Bước 3: Deploy Backend

```bash
# Clone and setup
cd /var/www
git clone <your-repo> vrc
cd vrc/backend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env file with production values

# Build application
pnpm build

# Start with PM2
pm2 start ecosystem.config.js --name "vrc-backend"
pm2 save
pm2 startup
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'vrc-backend',
    script: 'pnpm',
    args: 'start',
    cwd: '/var/www/vrc/backend',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/vrc-backend-error.log',
    out_file: '/var/log/pm2/vrc-backend-out.log',
    log_file: '/var/log/pm2/vrc-backend.log',
    time: true
  }, {
    name: 'vrc-frontend',
    script: 'serve',
    args: '-s dist -l 8080',
    cwd: '/var/www/vrc/vrcfrontend',
    instances: 1,
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

#### Bước 4: Deploy Frontend

```bash
cd /var/www/vrc/vrcfrontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit with production values

# Build for production
npm run build

# Install serve globally
npm install -g serve

# Start with PM2
pm2 start ecosystem.config.js --name "vrc-frontend"
```

#### Bước 5: Cấu Hình Nginx

```bash
# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Create VRC config
sudo nano /etc/nginx/sites-available/vrc
```

**/etc/nginx/sites-available/vrc:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Admin Panel
    location /admin/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Frontend
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/vrc /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 3. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 4. Monitoring và Maintenance

### System Monitoring

**Setup monitoring script:**
```bash
#!/bin/bash
# /home/deploy/monitor-vrc.sh

# Check services
pm2 status
docker-compose -f docker-compose.production.yml ps

# Check disk space
df -h

# Check memory
free -h

# Check logs
tail -f /var/log/nginx/access.log
pm2 logs vrc-backend --lines 50
```

### Backup Strategy

**Database Backup:**
```bash
#!/bin/bash
# /home/deploy/backup-mongo.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongo"
DB_NAME="vrcpayload"

mkdir -p $BACKUP_DIR

# Create backup
mongodump --db $DB_NAME --out $BACKUP_DIR/backup_$DATE

# Compress
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

**Automated Backup:**
```bash
# Add to crontab
0 2 * * * /home/deploy/backup-mongo.sh >> /var/log/backup.log 2>&1
```

### Log Management

**Log Rotation:**
```bash
# /etc/logrotate.d/vrc
/var/log/pm2/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 deploy deploy
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 5. Performance Optimization

### Backend Optimization

```javascript
// next.config.js additions
const nextConfig = {
  // ...existing config
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Output standalone for Docker
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp'],
  },
  
  // Bundle analyzer (development)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.plugins.push(new BundleAnalyzerPlugin())
      }
      return config
    }
  })
}
```

### Frontend Optimization

```typescript
// vite.config.ts additions
export default defineConfig({
  // ...existing config
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    }
  }
})
```

### CDN Setup (Optional)

```nginx
# Nginx config for static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    
    # Optional: Serve from CDN
    # proxy_pass https://your-cdn.com;
}
```

## 6. Security Checklist

### Server Security
- [ ] Firewall configured (UFW/iptables)
- [ ] SSH key authentication only
- [ ] Regular security updates
- [ ] Fail2ban installed
- [ ] Non-root user for deployment

### Application Security
- [ ] Strong secrets và environment variables
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] SQL injection protection
- [ ] XSS protection headers

### SSL/TLS
- [ ] SSL certificate installed
- [ ] HTTP to HTTPS redirect
- [ ] HSTS headers
- [ ] SSL Labs A+ rating

## 7. Troubleshooting

### Common Issues

**1. Port already in use:**
```bash
# Find process using port
lsof -i :3000
kill -9 <PID>
```

**2. MongoDB connection issues:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection
mongo --host localhost --port 27017
```

**3. Nginx configuration errors:**
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

**4. PM2 process issues:**
```bash
# Restart all processes
pm2 restart all

# Check logs
pm2 logs

# Reset PM2
pm2 kill
pm2 resurrect
```

### Health Check Endpoints

**Backend Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Frontend Health Check:**
```bash
curl http://localhost:8080/
```

## 8. Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx upstream)
- Multiple backend instances
- Redis session store
- Shared file storage

### Vertical Scaling
- Server resources monitoring
- Database optimization
- Caching strategies (Redis/Memcached)

## Kết Luận

Tài liệu này cung cấp hướng dẫn chi tiết để triển khai dự án VRC từ development đến production. Chọn phương thức triển khai phù hợp với infrastructure và yêu cầu của bạn:

- **Docker**: Khuyến nghị cho môi trường hiện đại, dễ scale
- **Manual**: Phù hợp với VPS truyền thống, kiểm soát tốt hơn

Luôn test trên staging environment trước khi deploy production và thiết lập monitoring để theo dõi hiệu suất hệ thống.
