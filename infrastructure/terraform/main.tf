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

resource "aws_elastic_beanstalk_application" "chit-chat" {
  name        = "Chit Chat"
  description = "Multiuser chat application"
}

resource "aws_elastic_beanstalk_environment" "chit-chat-environment" {
  name                = "chit-chat-environment"
  application         = aws_elastic_beanstalk_application.chit-chat.name
  solution_stack_name = "64bit Amazon Linux 2 v3.0.1 running Docker"
  wait_for_ready_timeout = "60m"

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = var.vpc_id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = var.subnet
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name = "InstanceType"
    value = "t2.micro"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.ec2.name
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value = "1"
  }

}

data "aws_iam_policy_document" "ec2" {
  statement {
    sid = ""

    actions = [
      "sts:AssumeRole",
    ]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    effect = "Allow"
  }

  statement {
    sid = ""

    actions = [
      "sts:AssumeRole",
    ]

    principals {
      type        = "Service"
      identifiers = ["ssm.amazonaws.com"]
    }

    effect = "Allow"
  }
}

resource "aws_iam_instance_profile" "ec2" {
  name = "chit-chat-eb-ec2"
  role = aws_iam_role.ec2.name
}

resource "aws_iam_role" "ec2" {
  name               = "chit-chat-eb-ec2"
  assume_role_policy = data.aws_iam_policy_document.ec2.json
}
