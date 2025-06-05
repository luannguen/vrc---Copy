#!/bin/bash

# VRC Deployment Script
# Usage: ./deploy.sh [development|production]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/vrc"
BACKUP_DIR="/backups/vrc"
LOG_FILE="/var/log/vrc-deploy.log"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Function to check if service is running
check_service() {
    if pm2 list | grep -q "$1"; then
        return 0
    else
        return 1
    fi
}

# Function to backup database
backup_database() {
    print_status "Creating database backup..."
    
    DATE=$(date +%Y%m%d_%H%M%S)
    mkdir -p $BACKUP_DIR
    
    # MongoDB backup
    mongodump --db vrcpayload --out $BACKUP_DIR/backup_$DATE
    
    if [ $? -eq 0 ]; then
        # Compress backup
        tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/backup_$DATE
        rm -rf $BACKUP_DIR/backup_$DATE
        
        print_success "Database backup created: backup_$DATE.tar.gz"
        log_message "Database backup completed: $BACKUP_DIR/backup_$DATE.tar.gz"
    else
        print_error "Database backup failed!"
        log_message "Database backup failed"
        exit 1
    fi
}

# Function to backup application files
backup_application() {
    print_status "Creating application backup..."
    
    DATE=$(date +%Y%m%d_%H%M%S)
    
    # Backup current application
    tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C /var/www vrc
    
    if [ $? -eq 0 ]; then
        print_success "Application backup created: app_backup_$DATE.tar.gz"
        log_message "Application backup completed: $BACKUP_DIR/app_backup_$DATE.tar.gz"
    else
        print_error "Application backup failed!"
        log_message "Application backup failed"
        exit 1
    fi
}

# Function to update code from git
update_code() {
    print_status "Updating code from git repository..."
    
    cd $PROJECT_DIR
    
    # Stash any local changes
    git stash
    
    # Pull latest changes
    git pull origin main
    
    if [ $? -eq 0 ]; then
        print_success "Code updated successfully"
        log_message "Code update completed"
    else
        print_error "Git pull failed!"
        log_message "Git pull failed"
        exit 1
    fi
}

# Function to install dependencies and build
build_application() {
    print_status "Installing dependencies and building application..."
    
    # Backend
    print_status "Building backend..."
    cd $PROJECT_DIR/backend
    pnpm install --frozen-lockfile
    pnpm build
    
    if [ $? -ne 0 ]; then
        print_error "Backend build failed!"
        log_message "Backend build failed"
        exit 1
    fi
    
    # Frontend
    print_status "Building frontend..."
    cd $PROJECT_DIR/vrcfrontend
    npm ci
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Frontend build failed!"
        log_message "Frontend build failed"
        exit 1
    fi
    
    print_success "Application built successfully"
    log_message "Application build completed"
}

# Function to run database migrations/seeds
run_migrations() {
    print_status "Running database migrations and seeds..."
    
    cd $PROJECT_DIR/backend
    
    # Run any necessary migrations or seeds
    # Add your migration commands here
    # Example: pnpm run migrate
    
    print_success "Migrations completed"
    log_message "Database migrations completed"
}

# Function to restart services
restart_services() {
    print_status "Restarting application services..."
    
    # Restart PM2 processes
    pm2 restart ecosystem.config.js --env production
    
    if [ $? -eq 0 ]; then
        print_success "Services restarted successfully"
        log_message "Services restart completed"
    else
        print_error "Service restart failed!"
        log_message "Service restart failed"
        exit 1
    fi
    
    # Wait for services to stabilize
    sleep 10
    
    # Check if services are running
    if check_service "vrc-backend" && check_service "vrc-frontend"; then
        print_success "All services are running"
        log_message "All services verified running"
    else
        print_error "Some services failed to start!"
        log_message "Service verification failed"
        exit 1
    fi
}

# Function to test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Test backend health
    if curl -f -s http://localhost:3000/api/health > /dev/null; then
        print_success "Backend health check passed"
    else
        print_error "Backend health check failed!"
        log_message "Backend health check failed"
        exit 1
    fi
    
    # Test frontend
    if curl -f -s http://localhost:8080/ > /dev/null; then
        print_success "Frontend health check passed"
    else
        print_error "Frontend health check failed!"
        log_message "Frontend health check failed"
        exit 1
    fi
    
    print_success "Deployment tests passed"
    log_message "Deployment tests completed successfully"
}

# Function to cleanup old backups
cleanup_backups() {
    print_status "Cleaning up old backups..."
    
    # Keep only last 7 days of backups
    find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
    
    print_success "Backup cleanup completed"
    log_message "Backup cleanup completed"
}

# Function to send notification (optional)
send_notification() {
    # Add your notification logic here (Slack, email, etc.)
    print_status "Deployment completed successfully!"
    log_message "Deployment notification sent"
}

# Main deployment function
deploy() {
    local environment=${1:-production}
    
    print_status "Starting VRC deployment for $environment environment..."
    log_message "Deployment started for $environment environment"
    
    # Pre-deployment checks
    if [ ! -d "$PROJECT_DIR" ]; then
        print_error "Project directory not found: $PROJECT_DIR"
        exit 1
    fi
    
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 not found. Please install PM2 first."
        exit 1
    fi
    
    # Create backup directory
    mkdir -p $BACKUP_DIR
    mkdir -p $(dirname $LOG_FILE)
    
    # Deployment steps
    backup_database
    backup_application
    update_code
    build_application
    
    if [ "$environment" = "production" ]; then
        run_migrations
    fi
    
    restart_services
    test_deployment
    cleanup_backups
    send_notification
    
    print_success "Deployment completed successfully!"
    log_message "Deployment completed successfully"
}

# Rollback function
rollback() {
    print_warning "Starting rollback process..."
    log_message "Rollback started"
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/app_backup_*.tar.gz | head -n1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        print_error "No backup found for rollback!"
        exit 1
    fi
    
    print_status "Rolling back to: $(basename $LATEST_BACKUP)"
    
    # Stop services
    pm2 stop all
    
    # Restore application
    cd /var/www
    rm -rf vrc
    tar -xzf $LATEST_BACKUP
    
    # Restart services
    cd $PROJECT_DIR
    pm2 start ecosystem.config.js --env production
    
    print_success "Rollback completed!"
    log_message "Rollback completed"
}

# Script usage
usage() {
    echo "Usage: $0 [deploy|rollback] [development|production]"
    echo ""
    echo "Commands:"
    echo "  deploy [env]     Deploy application (default: production)"
    echo "  rollback         Rollback to previous version"
    echo "  test            Run deployment tests only"
    echo "  backup          Create backup only"
    echo ""
    echo "Examples:"
    echo "  $0 deploy production"
    echo "  $0 deploy development"
    echo "  $0 rollback"
    echo "  $0 test"
    echo "  $0 backup"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        deploy "${2:-production}"
        ;;
    "rollback")
        rollback
        ;;
    "test")
        test_deployment
        ;;
    "backup")
        backup_database
        backup_application
        ;;
    "help"|"-h"|"--help")
        usage
        ;;
    *)
        print_error "Unknown command: $1"
        usage
        exit 1
        ;;
esac
