# chit-chat

Multiuser chat application

![ChitChat CI](https://github.com/mohankapil3/chit-chat/workflows/ChitChat%20CI/badge.svg)

Steps to build environment from scratch on AWS Beanstalk,

1. Create default VPC if doesn't exist
2. Create one self-signed certificate (use CN=chit-chat.com) and add it to ACM 
3. Use supplied terraform scripts to build AWS Beanstalk environment (terraform plan, apply)
4. Build application using "local-build.py" script, push resulting docker image to ECR (created in above step)
5. Update script "Dockerrun.aws.json" with correct ECR image URL and then deploy application manually in to Beanstalk environment created above
6. Wait for deployment to complete, copy URL from Beanstalk environment page and access application on HTTPS (as certificate is self-signed, browser will complain about insecure connection (NET::ERR_CERT_AUTHORITY_INVALID), ignore and continue)
