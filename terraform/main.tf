# Create an S3 Bucket to hold the static part of the frontend of the website
resource "aws_s3_bucket" "mern_bucket" {
  bucket = var.bucket_name

  tags = {
    Name        = "mern_website_static_files"
    Environment = "Dev"
  }
}

# Enable using the S3 bucket for a website
resource "aws_s3_bucket_website_configuration" "mern_website_config" {
  bucket = aws_s3_bucket.mern_bucket.id

  # basically, because it is a SPA, we want everything to point to index.html
  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

#  Creating bucket objects that include the production optimized source code
resource "aws_s3_object" "frontend_objects" {
  bucket   = aws_s3_bucket.mern_bucket.id
  for_each = fileset("../frontend/dist", "**/*.*")
  key      = each.value
  source   = "../frontend/dist/${each.value}"
  


  depends_on = [
    aws_s3_bucket.mern_bucket,
    aws_s3_bucket_website_configuration.mern_website_config
  ]
}

# Setting Cloudfront Distribution with a Custom Origin (The s3 bucket configured as a website)
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = "${aws_s3_bucket.mern_bucket.bucket}.s3-website-${var.region}.amazonaws.com"
    origin_id   = "myS3Origin"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "http-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_keepalive_timeout = 5
      origin_read_timeout      = 20
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    # allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "myS3Origin"


    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  # logging_config {
  #   include_cookies = false
  #   bucket          = "my-logs-bucket.s3.amazonaws.com"
  #   prefix          = "cdn-logs/"
  # }
}






output "website_url" {
  value = aws_s3_bucket_website_configuration.mern_website_config.website_endpoint
}

output "cloudfront_url" {
  value = aws_cloudfront_distribution.cdn.domain_name
}



# Creating the cloudfront distribution
# resource "aws_cloudfront_distribution" "mern_cf_distribution" {
#   default_cache_behavior {
#     origin = aws_s3_bucket.mern_bucket
#   }
#   enabled = true
#   origin = var.bucket_name
#   restrictions = {
#     geo_locations = none
#   }
#   viewer_certificate {
    
#   }

  
# }