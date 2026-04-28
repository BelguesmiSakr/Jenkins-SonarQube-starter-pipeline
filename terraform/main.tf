terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"  # Ireland — closest AWS region to France
}

# ── SSH Key Pair ─────────────────────────────────────────────────────────────
resource "aws_key_pair" "cicd_key" {
  key_name   = "cicd-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

# ── Security Group (shared by both instances) ────────────────────────────────
resource "aws_security_group" "cicd_sg" {
  name        = "cicd-sg"
  description = "CI/CD pipeline - open required ports"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Jenkins"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SonarQube"
    from_port   = 9000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP (frontend)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "cicd-sg"
  }
}

# ── Ubuntu 22.04 LTS AMI (Canonical) ─────────────────────────────────────────
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ── EC2 #1 — Jenkins ─────────────────────────────────────────────────────────
resource "aws_instance" "ec2_ci" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.small"    # free-tier eligible (2 vCPU / 2 GB)
  key_name                    = aws_key_pair.cicd_key.key_name
  vpc_security_group_ids      = [aws_security_group.cicd_sg.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = "ec2-jenkins"
  }
}

# ── EC2 #2 — SonarQube (dedicated) ────────────────────────────────────────────
resource "aws_instance" "ec2_sonarqube" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.small"    # free-tier eligible (2 vCPU / 2 GB)
  key_name                    = aws_key_pair.cicd_key.key_name
  vpc_security_group_ids      = [aws_security_group.cicd_sg.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "ec2-sonarqube"
  }
}

# ── EC2 #2 — Staging Server ───────────────────────────────────────────────────
resource "aws_instance" "ec2_staging" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.micro"    # free-tier eligible on this account (2 vCPU / 1 GB)
  key_name                    = aws_key_pair.cicd_key.key_name
  vpc_security_group_ids      = [aws_security_group.cicd_sg.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "ec2-staging-server"
  }
}
