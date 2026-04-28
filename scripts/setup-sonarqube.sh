#!/bin/bash
# Run this on the dedicated SonarQube EC2 instance
set -e

echo "=== Creating 2 GB swap ==="
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
else
  echo "Swap already exists, skipping."
fi

echo "=== Installing Docker ==="
if ! command -v docker &>/dev/null; then
  sudo apt-get update -y
  sudo apt-get install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --batch --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo usermod -aG docker ubuntu
else
  echo "Docker already installed, skipping."
fi

echo "=== Starting SonarQube ==="
if ! sudo docker ps -a --format '{{.Names}}' | grep -q '^sonarqube$'; then
  sudo docker run -d \
    --name sonarqube \
    --restart unless-stopped \
    -p 9000:9000 \
    -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
    sonarqube:community
else
  echo "SonarQube container already exists, starting it."
  sudo docker start sonarqube
fi

echo ""
echo "=== SonarQube setup complete ==="
echo "SonarQube: http://$(curl -s ifconfig.me):9000"
echo "Wait ~2 minutes for SonarQube to fully start, then login with admin/admin"
