provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
}

resource "aws_ecr_repository" "chit-chat-ecr-repo" {
  name = "chit-chat-ecr-repo"
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}