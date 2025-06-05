module.exports = {
  apps: [
    {
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
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/vrc-backend-error.log',
      out_file: '/var/log/pm2/vrc-backend-out.log',
      log_file: '/var/log/pm2/vrc-backend.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'vrc-frontend',
      script: 'serve',
      args: '-s dist -l 8080 --cors',
      cwd: '/var/www/vrc/vrcfrontend',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/pm2/vrc-frontend-error.log',
      out_file: '/var/log/pm2/vrc-frontend-out.log',
      log_file: '/var/log/pm2/vrc-frontend.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      restart_delay: 2000,
      max_restarts: 10,
      min_uptime: '5s'
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/vrc.git',
      path: '/var/www/vrc',
      'post-deploy': 'cd backend && pnpm install && pnpm build && cd ../vrcfrontend && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    }
  }
}
