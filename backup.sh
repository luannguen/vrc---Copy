#!/bin/bash

# VRC Database Backup Script
# Automatically backs up MongoDB database with compression and retention

# Configuration
DB_NAME="vrcpayload"
BACKUP_DIR="/backups/vrc"
RETENTION_DAYS=30
MONGO_HOST="localhost"
MONGO_PORT="27017"
MONGO_USER=""  # Set if authentication is required
MONGO_PASS=""  # Set if authentication is required

# Logging
LOG_FILE="/var/log/vrc-backup.log"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="vrc_backup_${DATE}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
    log_message "INFO: $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    log_message "SUCCESS: $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    log_message "ERROR: $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    log_message "WARNING: $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if mongodump is available
    if ! command -v mongodump &> /dev/null; then
        print_error "mongodump command not found. Please install MongoDB tools."
        exit 1
    fi
    
    # Check if MongoDB is running
    if ! mongosh --host $MONGO_HOST:$MONGO_PORT --eval "db.adminCommand('ismaster')" --quiet > /dev/null 2>&1; then
        print_error "Cannot connect to MongoDB at $MONGO_HOST:$MONGO_PORT"
        exit 1
    fi
    
    # Create backup directory
    mkdir -p $BACKUP_DIR
    if [ ! -w $BACKUP_DIR ]; then
        print_error "Backup directory $BACKUP_DIR is not writable"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to perform database backup
backup_database() {
    print_status "Starting database backup..."
    
    local backup_path="$BACKUP_DIR/$BACKUP_NAME"
    mkdir -p $backup_path
    
    # Build mongodump command
    local mongodump_cmd="mongodump --host $MONGO_HOST:$MONGO_PORT --db $DB_NAME --out $backup_path"
    
    # Add authentication if provided
    if [ ! -z "$MONGO_USER" ] && [ ! -z "$MONGO_PASS" ]; then
        mongodump_cmd="$mongodump_cmd --username $MONGO_USER --password $MONGO_PASS"
    fi
    
    # Execute backup
    if eval $mongodump_cmd; then
        print_success "Database backup completed"
    else
        print_error "Database backup failed"
        rm -rf $backup_path
        exit 1
    fi
    
    # Get backup size
    local backup_size=$(du -sh $backup_path | cut -f1)
    print_status "Backup size: $backup_size"
}

# Function to compress backup
compress_backup() {
    print_status "Compressing backup..."
    
    local backup_path="$BACKUP_DIR/$BACKUP_NAME"
    local compressed_file="$BACKUP_DIR/${BACKUP_NAME}.tar.gz"
    
    # Create compressed archive
    if tar -czf $compressed_file -C $BACKUP_DIR $BACKUP_NAME; then
        print_success "Backup compressed successfully"
        
        # Remove uncompressed directory
        rm -rf $backup_path
        
        # Get compressed size
        local compressed_size=$(du -sh $compressed_file | cut -f1)
        print_status "Compressed size: $compressed_size"
        
        # Set proper permissions
        chmod 600 $compressed_file
        
    else
        print_error "Backup compression failed"
        exit 1
    fi
}

# Function to verify backup integrity
verify_backup() {
    print_status "Verifying backup integrity..."
    
    local compressed_file="$BACKUP_DIR/${BACKUP_NAME}.tar.gz"
    
    # Test archive integrity
    if tar -tzf $compressed_file > /dev/null 2>&1; then
        print_success "Backup integrity verified"
    else
        print_error "Backup integrity check failed"
        exit 1
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    print_status "Cleaning up old backups (keeping last $RETENTION_DAYS days)..."
    
    local deleted_count=0
    
    # Find and delete old backup files
    while IFS= read -r -d '' file; do
        rm -f "$file"
        ((deleted_count++))
        print_status "Deleted old backup: $(basename "$file")"
    done < <(find $BACKUP_DIR -name "vrc_backup_*.tar.gz" -mtime +$RETENTION_DAYS -print0)
    
    if [ $deleted_count -gt 0 ]; then
        print_success "Cleaned up $deleted_count old backup(s)"
    else
        print_status "No old backups to clean up"
    fi
}

# Function to list existing backups
list_backups() {
    print_status "Existing backups:"
    
    if ls $BACKUP_DIR/vrc_backup_*.tar.gz 1> /dev/null 2>&1; then
        for backup in $BACKUP_DIR/vrc_backup_*.tar.gz; do
            local size=$(du -sh "$backup" | cut -f1)
            local date=$(stat -c %y "$backup" | cut -d' ' -f1)
            echo "  $(basename "$backup") - $size - $date"
        done
    else
        echo "  No backups found"
    fi
}

# Function to restore from backup
restore_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        print_error "Backup file not specified"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_warning "This will restore the database and overwrite existing data!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Restore cancelled"
        exit 0
    fi
    
    print_status "Restoring from backup: $backup_file"
    
    # Create temporary directory for extraction
    local temp_dir=$(mktemp -d)
    
    # Extract backup
    if tar -xzf "$backup_file" -C "$temp_dir"; then
        print_success "Backup extracted"
    else
        print_error "Failed to extract backup"
        rm -rf "$temp_dir"
        exit 1
    fi
    
    # Find the database directory
    local db_dir=$(find "$temp_dir" -name "$DB_NAME" -type d | head -n1)
    
    if [ -z "$db_dir" ]; then
        print_error "Database directory not found in backup"
        rm -rf "$temp_dir"
        exit 1
    fi
    
    # Build mongorestore command
    local mongorestore_cmd="mongorestore --host $MONGO_HOST:$MONGO_PORT --db $DB_NAME --drop $db_dir"
    
    # Add authentication if provided
    if [ ! -z "$MONGO_USER" ] && [ ! -z "$MONGO_PASS" ]; then
        mongorestore_cmd="$mongorestore_cmd --username $MONGO_USER --password $MONGO_PASS"
    fi
    
    # Execute restore
    if eval $mongorestore_cmd; then
        print_success "Database restored successfully"
    else
        print_error "Database restore failed"
        rm -rf "$temp_dir"
        exit 1
    fi
    
    # Clean up
    rm -rf "$temp_dir"
    print_success "Restore completed"
}

# Function to send notification
send_notification() {
    local status="$1"
    local message="$2"
    
    # Email notification (customize as needed)
    if command -v mail &> /dev/null; then
        echo "$message" | mail -s "VRC Backup $status" admin@your-domain.com
    fi
    
    # Slack notification (add webhook URL)
    # curl -X POST -H 'Content-type: application/json' \
    #   --data "{\"text\":\"VRC Backup $status: $message\"}" \
    #   YOUR_SLACK_WEBHOOK_URL
}

# Main backup function
perform_backup() {
    print_status "VRC Database Backup Started"
    print_status "Backup name: $BACKUP_NAME"
    
    local start_time=$(date +%s)
    
    check_prerequisites
    backup_database
    compress_backup
    verify_backup
    cleanup_old_backups
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    print_success "Backup completed successfully in ${duration} seconds"
    
    # Get final backup info
    local backup_file="$BACKUP_DIR/${BACKUP_NAME}.tar.gz"
    local final_size=$(du -sh "$backup_file" | cut -f1)
    
    local success_message="VRC database backup completed successfully
Backup file: $backup_file
Size: $final_size
Duration: ${duration} seconds
Date: $(date)"
    
    send_notification "Success" "$success_message"
    print_success "Backup process completed"
}

# Function to show usage
show_usage() {
    echo "VRC Database Backup Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  backup          Perform database backup (default)"
    echo "  restore <file>  Restore from backup file"
    echo "  list            List existing backups"
    echo "  cleanup         Cleanup old backups only"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Perform backup"
    echo "  $0 backup                            # Perform backup"
    echo "  $0 restore /backups/vrc/backup.tar.gz  # Restore from file"
    echo "  $0 list                              # List backups"
    echo "  $0 cleanup                           # Cleanup old backups"
    echo ""
    echo "Configuration:"
    echo "  Database: $DB_NAME"
    echo "  Backup directory: $BACKUP_DIR"
    echo "  Retention: $RETENTION_DAYS days"
    echo "  MongoDB: $MONGO_HOST:$MONGO_PORT"
}

# Create log directory
mkdir -p $(dirname $LOG_FILE)

# Main script logic
case "${1:-backup}" in
    "backup"|"")
        perform_backup
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "list")
        list_backups
        ;;
    "cleanup")
        check_prerequisites
        cleanup_old_backups
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac
