#!/bin/bash

# Production Deployment Script for Village Infrastructure Digital Twin
# This script sets up the complete production environment with real data integration

set -e  # Exit on any error

echo "🚀 Starting Village Infrastructure Digital Twin Production Deployment..."

# Configuration
PROJECT_NAME="village-infra-digital-twin"
DOMAIN="your-domain.com"
DB_NAME="village_production"
DB_USER="village_user"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check prerequisites
print_status "Checking prerequisites..."

command -v docker >/dev/null 2>&1 || { print_error "Docker is required but not installed. Aborting."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { print_error "Docker Compose is required but not installed. Aborting."; exit 1; }
command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed. Aborting."; exit 1; }

print_status "Prerequisites check passed ✓"

# Create production environment file
print_status "Setting up production environment..."

if [ ! -f .env.production ]; then
    print_warning "Creating .env.production file. Please update with your actual values."
    
    cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production
REACT_APP_ENV=production

# API Configuration
REACT_APP_API_URL=https://api.${DOMAIN}
REACT_APP_WEBSOCKET_URL=https://ws.${DOMAIN}

# Database
DATABASE_URL=postgresql://${DB_USER}:\${DB_PASSWORD}@localhost:5432/${DB_NAME}
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=\${JWT_SECRET}
CORS_ORIGIN=https://${DOMAIN}

# InfluxDB (IoT Data)
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=\${INFLUX_TOKEN}
INFLUX_ORG=village_production
INFLUX_BUCKET=sensor_data

# MQTT (IoT Devices)
MQTT_URL=mqtt://localhost:1883
MQTT_USERNAME=village_iot_prod
MQTT_PASSWORD=\${MQTT_PASSWORD}

# Blockchain
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/\${INFURA_PROJECT_ID}
CONTRACT_ADDRESS=\${CONTRACT_ADDRESS}
PRIVATE_KEY=\${ETHEREUM_PRIVATE_KEY}

# External Services
TWILIO_ACCOUNT_SID=\${TWILIO_ACCOUNT_SID}
TWILIO_AUTH_TOKEN=\${TWILIO_AUTH_TOKEN}
WEATHER_API_KEY=\${WEATHER_API_KEY}
MAPS_API_KEY=\${MAPS_API_KEY}

# Monitoring
SENTRY_DSN=\${SENTRY_DSN}
LOG_LEVEL=warn

# Performance
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_WINDOW_MS=900000
EOF

    print_warning "Please update .env.production with your actual API keys and secrets before continuing."
    read -p "Press Enter when you have updated the environment file..."
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci --production

# Build frontend
print_status "Building frontend for production..."
npm run build

# Setup database
print_status "Setting up production database..."

# Create database user and database
sudo -u postgres psql << EOF
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
\q
EOF

# Run database migrations
print_status "Running database migrations..."
# This would run your actual migration scripts
# npx prisma migrate deploy  # if using Prisma
# or
# psql -U ${DB_USER} -d ${DB_NAME} -f database/schema.sql

# Setup InfluxDB
print_status "Setting up InfluxDB for IoT data..."
docker run -d \
  --name influxdb-production \
  -p 8086:8086 \
  -v influxdb-data:/var/lib/influxdb2 \
  -e DOCKER_INFLUXDB_INIT_MODE=setup \
  -e DOCKER_INFLUXDB_INIT_USERNAME=admin \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=${INFLUX_PASSWORD} \
  -e DOCKER_INFLUXDB_INIT_ORG=village_production \
  -e DOCKER_INFLUXDB_INIT_BUCKET=sensor_data \
  influxdb:2.0

# Setup MQTT Broker
print_status "Setting up MQTT broker for IoT devices..."
docker run -d \
  --name mosquitto-production \
  -p 1883:1883 \
  -p 9001:9001 \
  -v mosquitto-data:/mosquitto/data \
  -v mosquitto-logs:/mosquitto/log \
  eclipse-mosquitto:2

# Setup Redis for caching
print_status "Setting up Redis for caching..."
docker run -d \
  --name redis-production \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7-alpine redis-server --appendonly yes

# Setup Nginx reverse proxy
print_status "Setting up Nginx reverse proxy..."

sudo tee /etc/nginx/sites-available/${PROJECT_NAME} > /dev/null << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    # Frontend
    location / {
        root /var/www/${PROJECT_NAME}/build;
        try_files \$uri \$uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket for real-time data
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        root /var/www/${PROJECT_NAME}/build;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/${PROJECT_NAME} /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Setup SSL certificate
print_status "Setting up SSL certificate..."
sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN}

# Setup systemd services for backend processes
print_status "Setting up systemd services..."

# Backend API service
sudo tee /etc/systemd/system/${PROJECT_NAME}-api.service > /dev/null << EOF
[Unit]
Description=Village Infrastructure API
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/${PROJECT_NAME}/backend
Environment=NODE_ENV=production
EnvironmentFile=/var/www/${PROJECT_NAME}/.env.production
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# ML Service
sudo tee /etc/systemd/system/${PROJECT_NAME}-ml.service > /dev/null << EOF
[Unit]
Description=Village Infrastructure ML Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/${PROJECT_NAME}/ml_services
Environment=PYTHONPATH=/var/www/${PROJECT_NAME}/ml_services
EnvironmentFile=/var/www/${PROJECT_NAME}/.env.production
ExecStart=/usr/bin/python3 app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable ${PROJECT_NAME}-api.service
sudo systemctl enable ${PROJECT_NAME}-ml.service
sudo systemctl start ${PROJECT_NAME}-api.service
sudo systemctl start ${PROJECT_NAME}-ml.service

# Setup log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/${PROJECT_NAME} > /dev/null << EOF
/var/log/${PROJECT_NAME}/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload ${PROJECT_NAME}-api.service
        systemctl reload ${PROJECT_NAME}-ml.service
    endscript
}
EOF

# Setup monitoring
print_status "Setting up monitoring..."

# Install and configure Prometheus
docker run -d \
  --name prometheus-production \
  -p 9090:9090 \
  -v prometheus-data:/prometheus \
  prom/prometheus:latest

# Install and configure Grafana
docker run -d \
  --name grafana-production \
  -p 3001:3000 \
  -v grafana-data:/var/lib/grafana \
  -e GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD} \
  grafana/grafana:latest

# Setup backup script
print_status "Setting up automated backups..."
sudo tee /usr/local/bin/village-backup.sh > /dev/null << 'EOF'
#!/bin/bash

BACKUP_DIR="/var/backups/village-infra"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="village_production"

mkdir -p ${BACKUP_DIR}

# Database backup
pg_dump ${DB_NAME} | gzip > ${BACKUP_DIR}/db_${DATE}.sql.gz

# InfluxDB backup
docker exec influxdb-production influx backup /tmp/backup_${DATE}
docker cp influxdb-production:/tmp/backup_${DATE} ${BACKUP_DIR}/influx_${DATE}

# Application files backup
tar -czf ${BACKUP_DIR}/app_${DATE}.tar.gz /var/www/village-infra-digital-twin

# Clean old backups (keep 30 days)
find ${BACKUP_DIR} -name "*.gz" -mtime +30 -delete
find ${BACKUP_DIR} -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: ${DATE}"
EOF

sudo chmod +x /usr/local/bin/village-backup.sh

# Setup cron job for backups
echo "0 2 * * * /usr/local/bin/village-backup.sh >> /var/log/village-backup.log 2>&1" | sudo crontab -

# Setup firewall
print_status "Configuring firewall..."
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 1883/tcp    # MQTT
sudo ufw --force enable

# Final security hardening
print_status "Applying security hardening..."

# Disable root SSH login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Setup fail2ban
sudo apt-get update && sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Create deployment info file
print_status "Creating deployment information..."
cat > deployment-info.txt << EOF
Village Infrastructure Digital Twin - Production Deployment
===========================================================

Deployment Date: $(date)
Domain: https://${DOMAIN}
API Endpoint: https://api.${DOMAIN}
WebSocket: https://ws.${DOMAIN}

Services:
- Frontend: Nginx (Port 80/443)
- Backend API: Node.js (Port 3000)
- Database: PostgreSQL (Port 5432)
- Cache: Redis (Port 6379)
- IoT Data: InfluxDB (Port 8086)
- MQTT Broker: Mosquitto (Port 1883)
- ML Service: Python Flask (Port 5000)
- Monitoring: Grafana (Port 3001)

Important Files:
- Environment: /var/www/${PROJECT_NAME}/.env.production
- Nginx Config: /etc/nginx/sites-available/${PROJECT_NAME}
- Service Files: /etc/systemd/system/${PROJECT_NAME}-*.service
- Backup Script: /usr/local/bin/village-backup.sh
- SSL Certificates: /etc/letsencrypt/live/${DOMAIN}/

Next Steps:
1. Update .env.production with your actual API keys
2. Configure IoT devices to connect to MQTT broker
3. Set up blockchain smart contracts
4. Configure external service integrations
5. Test all functionality thoroughly
6. Set up monitoring alerts

For support, check logs:
- API: journalctl -u ${PROJECT_NAME}-api.service
- ML: journalctl -u ${PROJECT_NAME}-ml.service
- Nginx: tail -f /var/log/nginx/error.log
- System: tail -f /var/log/syslog
EOF

print_status "Deployment completed successfully! 🎉"
print_status "Check deployment-info.txt for important information."
print_warning "Don't forget to:"
echo "  1. Update API keys in .env.production"
echo "  2. Configure IoT device connections"
echo "  3. Set up monitoring alerts"
echo "  4. Test all functionality"
echo ""
print_status "Your Village Infrastructure Digital Twin is now running at: https://${DOMAIN}"
