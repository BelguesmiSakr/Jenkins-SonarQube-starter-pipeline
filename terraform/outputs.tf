output "ec2_jenkins_public_ip" {
  description = "Public IP of EC2 Jenkins"
  value       = aws_instance.ec2_ci.public_ip
}

output "ec2_sonarqube_public_ip" {
  description = "Public IP of EC2 SonarQube"
  value       = aws_instance.ec2_sonarqube.public_ip
}

output "ec2_staging_public_ip" {
  description = "Public IP of EC2 Staging"
  value       = aws_instance.ec2_staging.public_ip
}

output "ssh_jenkins" {
  value = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_instance.ec2_ci.public_ip}"
}

output "ssh_sonarqube" {
  value = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_instance.ec2_sonarqube.public_ip}"
}

output "ssh_staging" {
  value = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_instance.ec2_staging.public_ip}"
}

output "jenkins_url" {
  value = "http://${aws_instance.ec2_ci.public_ip}:8080"
}

output "sonarqube_url" {
  value = "http://${aws_instance.ec2_sonarqube.public_ip}:9000"
}

output "frontend_url" {
  value = "http://${aws_instance.ec2_staging.public_ip}"
}
