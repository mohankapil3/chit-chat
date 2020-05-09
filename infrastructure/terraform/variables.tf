variable "vpc_id" {
  type        = string
  description = "ID of the VPC in which to provision the AWS resources"
}

variable "subnet" {
  type        = string
  description = "Subnet in which to provision the AWS resources"
}