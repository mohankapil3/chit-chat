provider "aws" {
  version = "~> 2.0"
  region = "us-east-1"
}

resource "aws_ecr_repository" "chit-chat-ecr-repo" {
  name = "chit-chat-ecr-repo"
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_elastic_beanstalk_application" "chit-chat" {
  name = "Chit Chat"
  description = "Multiuser chat application"
}

resource "aws_elastic_beanstalk_environment" "chit-chat" {
  name = "chit-chat"
  application = aws_elastic_beanstalk_application.chit-chat.name
  solution_stack_name = "64bit Amazon Linux 2 v3.0.1 running Docker"
  wait_for_ready_timeout = "60m"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name = "InstanceType"
    value = "t2.micro"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name = "IamInstanceProfile"
    value = aws_iam_instance_profile.ec2.name
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name = "Availability Zones"
    value = "Any 2"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name = "MaxSize"
    value = "1"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name = "LoadBalancerType"
    value = "application"
  }

  setting {
    namespace = "aws:elbv2:listener:80"
    name = "ListenerEnabled"
    value = "false"
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name = "ListenerEnabled"
    value = "true"
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name = "Protocol"
    value = "HTTPS"
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name = "SSLCertificateArns"
    value = data.aws_acm_certificate.chit-chat-acm-certificate.arn
  }
}

data "aws_acm_certificate" "chit-chat-acm-certificate" {
  domain   = "chit-chat.com"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "chit-chat-eb-ec2-instance-profile"
  role = aws_iam_role.ec2.name
}

resource "aws_iam_role" "ec2" {
  name = "chit-chat-eb-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2.json
}

data "aws_iam_policy_document" "ec2" {
  version = "2012-10-17"
  statement {
    sid = ""

    actions = [
      "sts:AssumeRole",
    ]

    principals {
      type = "Service"
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
      type = "Service"
      identifiers = ["ssm.amazonaws.com"]
    }

    effect = "Allow"
  }
}

resource "aws_iam_role_policy_attachment" "ec2-read-only-ecr-policy-attachment" {
  role = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}
