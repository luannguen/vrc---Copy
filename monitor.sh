#!/bin/bash

# VRC System Health Monitoring Script
# Run this script periodically to monitor system health

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
LOG_FILE="/var/log/vrc-monitor.log"
ALERT_EMAIL="admin@your-domain.com"
ALERT_THRESHOLD_CPU=80
ALERT_THRESHOLD_MEMORY=85
ALERT_THRESHOLD_DISK=90

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Function to send alert (customize as needed)
send_alert() {
    local subject="$1"
    local message="$2"
    
    # Email alert (requires mail command)
    if command -v mail &> /dev/null; then
        echo "$message" | mail -s "$subject" $ALERT_EMAIL
    fi
    
    # Log alert
    log_message "ALERT: $subject - $message"
}

# Check system resources
check_system_resources() {
    echo -e "${BLUE}=== System Resources ===${NC}"
    
    # CPU Usage
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    echo "CPU Usage: ${CPU_USAGE}%"
    
    if (( $(echo "$CPU_USAGE > $ALERT_THRESHOLD_CPU" | bc -l) )); then
        send_alert "High CPU Usage" "CPU usage is ${CPU_USAGE}% (threshold: ${ALERT_THRESHOLD_CPU}%)"
    fi
    
    # Memory Usage
    MEMORY_INFO=$(free | grep Mem)
    TOTAL_MEM=$(echo $MEMORY_INFO | awk '{print $2}')
    USED_MEM=$(echo $MEMORY_INFO | awk '{print $3}')
    MEMORY_USAGE=$(awk "BEGIN {printf \"%.1f\", $USED_MEM/$TOTAL_MEM * 100}")
    
    echo "Memory Usage: ${MEMORY_USAGE}%"
    
    if (( $(echo "$MEMORY_USAGE > $ALERT_THRESHOLD_MEMORY" | bc -l) )); then
        send_alert "High Memory Usage" "Memory usage is ${MEMORY_USAGE}% (threshold: ${ALERT_THRESHOLD_MEMORY}%)"
    fi
    
    # Disk Usage
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    echo "Disk Usage: ${DISK_USAGE}%"
    
    if [ "$DISK_USAGE" -gt "$ALERT_THRESHOLD_DISK" ]; then
        send_alert "High Disk Usage" "Disk usage is ${DISK_USAGE}% (threshold: ${ALERT_THRESHOLD_DISK}%)"
    fi
}

# Check PM2 processes
check_pm2_processes() {
    echo -e "\n${BLUE}=== PM2 Processes ===${NC}"
    
    if command -v pm2 &> /dev/null; then
        pm2 status
        
        # Check if VRC processes are running
        if ! pm2 list | grep -q "vrc-backend.*online"; then
            send_alert "VRC Backend Down" "VRC Backend process is not running"
            echo -e "${RED}VRC Backend is DOWN${NC}"
        else
            echo -e "${GREEN}VRC Backend is running${NC}"
        fi
        
        if ! pm2 list | grep -q "vrc-frontend.*online"; then
            send_alert "VRC Frontend Down" "VRC Frontend process is not running"
            echo -e "${RED}VRC Frontend is DOWN${NC}"
        else
            echo -e "${GREEN}VRC Frontend is running${NC}"
        fi
    else
        echo "PM2 not installed"
    fi
}

# Check Docker containers (if using Docker)
check_docker_containers() {
    echo -e "\n${BLUE}=== Docker Containers ===${NC}"
    
    if command -v docker &> /dev/null; then
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
        # Check VRC containers
        if docker ps | grep -q "vrc-backend.*Up"; then
            echo -e "${GREEN}VRC Backend container is running${NC}"
        else
            send_alert "VRC Backend Container Down" "VRC Backend Docker container is not running"
            echo -e "${RED}VRC Backend container is DOWN${NC}"
        fi
        
        if docker ps | grep -q "vrc-frontend.*Up"; then
            echo -e "${GREEN}VRC Frontend container is running${NC}"
        else
            send_alert "VRC Frontend Container Down" "VRC Frontend Docker container is not running"
            echo -e "${RED}VRC Frontend container is DOWN${NC}"
        fi
    else
        echo "Docker not installed or not accessible"
    fi
}

# Check MongoDB
check_mongodb() {
    echo -e "\n${BLUE}=== MongoDB Status ===${NC}"
    
    if command -v mongo &> /dev/null; then
        # Test MongoDB connection
        if mongo --eval "db.adminCommand('ismaster')" --quiet > /dev/null 2>&1; then
            echo -e "${GREEN}MongoDB is running${NC}"
            
            # Check database size
            DB_SIZE=$(mongo vrcpayload --eval "db.stats().dataSize" --quiet 2>/dev/null)
            if [ ! -z "$DB_SIZE" ]; then
                echo "Database size: $(($DB_SIZE / 1024 / 1024)) MB"
            fi
        else
            send_alert "MongoDB Down" "MongoDB is not responding"
            echo -e "${RED}MongoDB is DOWN${NC}"
        fi
    else
        echo "MongoDB client not installed"
    fi
}

# Check Nginx
check_nginx() {
    echo -e "\n${BLUE}=== Nginx Status ===${NC}"
    
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}Nginx is running${NC}"
        
        # Check configuration
        if nginx -t 2>&1 | grep -q "successful"; then
            echo -e "${GREEN}Nginx configuration is valid${NC}"
        else
            send_alert "Nginx Configuration Error" "Nginx configuration test failed"
            echo -e "${RED}Nginx configuration has errors${NC}"
        fi
    else
        send_alert "Nginx Down" "Nginx service is not running"
        echo -e "${RED}Nginx is DOWN${NC}"
    fi
}

# Check application health endpoints
check_application_health() {
    echo -e "\n${BLUE}=== Application Health ===${NC}"
    
    # Check backend health
    if curl -f -s http://localhost:3000/api/health > /dev/null; then
        echo -e "${GREEN}Backend health check: PASS${NC}"
    else
        send_alert "Backend Health Check Failed" "Backend health endpoint is not responding"
        echo -e "${RED}Backend health check: FAIL${NC}"
    fi
    
    # Check frontend
    if curl -f -s http://localhost:8080/health > /dev/null; then
        echo -e "${GREEN}Frontend health check: PASS${NC}"
    else
        send_alert "Frontend Health Check Failed" "Frontend health endpoint is not responding"
        echo -e "${RED}Frontend health check: FAIL${NC}"
    fi
    
    # Check external access (if SSL is configured)
    if curl -f -s https://your-domain.com/health > /dev/null; then
        echo -e "${GREEN}External access: PASS${NC}"
    else
        echo -e "${YELLOW}External access: Cannot verify (check domain configuration)${NC}"
    fi
}

# Check SSL certificate expiration
check_ssl_certificate() {
    echo -e "\n${BLUE}=== SSL Certificate ===${NC}"
    
    CERT_FILE="/etc/nginx/ssl/fullchain.pem"
    
    if [ -f "$CERT_FILE" ]; then
        EXPIRY_DATE=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)
        EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
        CURRENT_EPOCH=$(date +%s)
        DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))
        
        echo "SSL certificate expires in: $DAYS_UNTIL_EXPIRY days"
        
        if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ]; then
            send_alert "SSL Certificate Expiring Soon" "SSL certificate expires in $DAYS_UNTIL_EXPIRY days"
            echo -e "${YELLOW}SSL certificate expires soon!${NC}"
        elif [ "$DAYS_UNTIL_EXPIRY" -lt 7 ]; then
            send_alert "SSL Certificate Expiring Very Soon" "SSL certificate expires in $DAYS_UNTIL_EXPIRY days"
            echo -e "${RED}SSL certificate expires very soon!${NC}"
        else
            echo -e "${GREEN}SSL certificate is valid${NC}"
        fi
    else
        echo "SSL certificate file not found"
    fi
}

# Check log file sizes
check_log_sizes() {
    echo -e "\n${BLUE}=== Log File Sizes ===${NC}"
    
    LOG_DIRS=("/var/log/nginx" "/var/log/pm2" "/var/log")
    
    for dir in "${LOG_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            echo "Logs in $dir:"
            find "$dir" -name "*.log" -type f -exec ls -lh {} \; | awk '{print $5 "\t" $9}' | sort -hr | head -5
        fi
    done
    
    # Check for large log files (>100MB)
    LARGE_LOGS=$(find /var/log -name "*.log" -size +100M 2>/dev/null)
    if [ ! -z "$LARGE_LOGS" ]; then
        send_alert "Large Log Files Found" "Large log files detected: $LARGE_LOGS"
        echo -e "${YELLOW}Large log files found - consider rotation${NC}"
    fi
}

# Check network connectivity
check_network() {
    echo -e "\n${BLUE}=== Network Connectivity ===${NC}"
    
    # Check internet connectivity
    if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        echo -e "${GREEN}Internet connectivity: OK${NC}"
    else
        send_alert "Network Connectivity Issue" "Cannot reach external networks"
        echo -e "${RED}Internet connectivity: FAIL${NC}"
    fi
    
    # Check DNS resolution
    if nslookup google.com > /dev/null 2>&1; then
        echo -e "${GREEN}DNS resolution: OK${NC}"
    else
        send_alert "DNS Resolution Issue" "DNS resolution is not working"
        echo -e "${RED}DNS resolution: FAIL${NC}"
    fi
}

# Generate summary report
generate_summary() {
    echo -e "\n${BLUE}=== Summary Report ===${NC}"
    echo "Monitoring completed at: $(date)"
    echo "System uptime: $(uptime -p)"
    echo "Load average: $(uptime | awk '{print $10 $11 $12}')"
    
    # Count recent errors in logs
    ERROR_COUNT=$(grep -i error /var/log/vrc-monitor.log 2>/dev/null | wc -l || echo 0)
    ALERT_COUNT=$(grep -i alert /var/log/vrc-monitor.log 2>/dev/null | wc -l || echo 0)
    
    echo "Recent errors: $ERROR_COUNT"
    echo "Recent alerts: $ALERT_COUNT"
    
    if [ "$ALERT_COUNT" -gt 0 ] || [ "$ERROR_COUNT" -gt 5 ]; then
        echo -e "${YELLOW}System needs attention${NC}"
    else
        echo -e "${GREEN}System is healthy${NC}"
    fi
}

# Main monitoring function
main() {
    echo "VRC System Health Monitor - $(date)"
    echo "=========================================="
    
    log_message "Health check started"
    
    check_system_resources
    check_pm2_processes
    check_docker_containers
    check_mongodb
    check_nginx
    check_application_health
    check_ssl_certificate
    check_log_sizes
    check_network
    generate_summary
    
    log_message "Health check completed"
    
    echo ""
    echo "Full log available at: $LOG_FILE"
}

# Create log directory if it doesn't exist
mkdir -p $(dirname $LOG_FILE)

# Run main function
main
