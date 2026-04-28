output "ec2_ci_public_ip" {
  description = "Public IP of EC2 #1 (Jenkins + SonarQube)"
  value       = aws_instance.ec2_ci.public_ip
}

output "ec2_staging_public_ip" {
  description = "Public IP of EC2 #2 (Staging / Docker Compose)"
  value       = aws_instance.ec2_staging.public_ip
}

output "ssh_ci" {
  description = "SSH command for CI server"
  value       = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_instance.ec2_ci.public_ip}"
}

output "ssh_staging" {
  description = "SSH command for staging server"
  value       = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_instance.ec2_staging.public_ip}"
}

output "jenkins_url" {
  description = "Jenkins UI"
  value       = "http://${aws_instance.ec2_ci.public_ip}:8080"
}

output "sonarqube_url" {
  description = "SonarQube UI"
  value       = "http://${aws_instance.ec2_ci.public_ip}:9000"
}

output "frontend_url" {
  description = "Staging frontend"
  value       = "http://${aws_instance.ec2_staging.public_ip}"
}
