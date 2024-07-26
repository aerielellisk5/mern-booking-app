variable "bucket_name" {
  type        = string
  description = "The name of the S3 bucket for this file"
  default     = "mern-bucket-app-aek9-10-01-06"
}

variable "region" {
  type        = string
  description = "The name of the default region in AWS"
  default     = "us-east-1"
}

