output "chit-chat-ecr-repo_url" {
  value = aws_ecr_repository.chit-chat-ecr-repo.repository_url
}

output "chit-chat-platform-endpoint_url" {
  value = aws_elastic_beanstalk_environment.chit-chat-environment.endpoint_url
}