output "chit-chat-ecr-repo_url" {
  value = aws_ecr_repository.chit-chat-ecr-repo.repository_url
}

output "chit-chat-platform-environment_cname" {
  value = aws_elastic_beanstalk_environment.chit-chat.cname
}