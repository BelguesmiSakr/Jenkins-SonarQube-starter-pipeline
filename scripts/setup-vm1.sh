#!/bin/bash
# Run this on VM1 (CI server) after terraform apply
set -e

echo "=== Creating 2 GB swap (needed for SonarQube on t2.micro) ==="
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

echo "=== Starting Jenkins ==="
sudo docker run -d \
  --name jenkins \
  --restart unless-stopped \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts-jdk17

echo "=== Installing Docker CLI inside Jenkins container ==="
sleep 15  # wait for container to be ready

sudo docker exec -u root jenkins bash -c "
  if ! command -v docker > /dev/null 2>&1; then
    apt-get update -y -qq
    apt-get install -y -qq docker.io
  else
    echo 'Docker CLI already present'
  fi
"

# Match the GID of the host docker socket so the jenkins user can use it
DOCKER_GID=$(stat -c '%g' /var/run/docker.sock)
sudo docker exec -u root jenkins bash -c "
  groupmod -g ${DOCKER_GID} docker 2>/dev/null; usermod -aG docker jenkins
"

sudo docker restart jenkins
echo "Waiting for Jenkins to restart..."
sleep 20

echo "=== Installing Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo ""
echo "=== Setup complete ==="
echo "Jenkins: http://$(curl -s ifconfig.me):8080"
echo "SonarQube: http://$(curl -s ifconfig.me):9000"
echo ""
echo "Jenkins initial admin password:"
sudo docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
