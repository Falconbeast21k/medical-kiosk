# Medical Kiosk Deployment Guide

## Quick Start (Development)

```bash
# 1. Install dependencies
npm run install-all

# 2. Initialize database
cd server
npm run db:init
npm run db:seed
cd ..

# 3. Start development server
npm run dev
```

Visit http://localhost:3000 in your browser.

## Deployment (Production)

### Build Frontend
```bash
cd client
npm run build
```

### Build Backend
```bash
cd server
npm start
```

## Docker Deployment

Create a `Dockerfile` in root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/

# Install dependencies
RUN npm install --workspace=client && npm install --workspace=server

# Copy source
COPY . .

# Build frontend
RUN npm run build --workspace=client

# Expose ports
EXPOSE 3000 5000

# Start server
CMD ["npm", "start", "--workspace=server"]
```

Build and run:
```bash
docker build -t medical-kiosk .
docker run -p 3000:3000 -p 5000:5000 medical-kiosk
```

## Raspberry Pi Setup

1. Install Node.js:
```bash
curl -sL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install -y nodejs
```

2. Clone project and setup:
```bash
git clone <repository>
cd medical-kiosk
npm run install-all
```

3. Initialize database:
```bash
cd server && npm run db:init && npm run db:seed
```

4. Run as service (systemd):

Create `/etc/systemd/system/medical-kiosk.service`:
```
[Unit]
Description=Medical Kiosk Application
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/medical-kiosk
ExecStart=/usr/bin/npm start --workspace=server
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable medical-kiosk
sudo systemctl start medical-kiosk
```

## Tablet Configuration

1. Access from tablet on same network:
   - Get Raspberry Pi IP: `hostname -I`
   - Navigate to: `http://<PI_IP>:3000`

2. Full screen mode (kiosk mode):
   - Press F11 (fullscreen)
   - Or use tablet's kiosk mode settings

## Demo Credentials

- Username: `admin`
- Password: `admin123`

## Troubleshooting

**Database issues:**
```bash
cd server
rm database/medical_kiosk.db
npm run db:init
npm run db:seed
```

**Port conflicts:**
Edit `server/.env` and `client/vite.config.js` to change ports

**API not responding:**
Check firewall settings and ensure backend is running
