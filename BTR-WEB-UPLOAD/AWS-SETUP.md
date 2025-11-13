# AWS Services Setup Guide

## Prerequisites
- AWS Account with administrative access
- AWS CLI installed and configured
- Basic understanding of AWS services

## Step 1: S3 Bucket Setup

### Create S3 Bucket
```bash
aws s3 mb s3://treasury-documents --region ap-southeast-1
```

### Create Regional Folder Structure
```bash
# Create folders for each region
aws s3api put-object --bucket treasury-documents --key region-1/ --region ap-southeast-1
aws s3api put-object --bucket treasury-documents --key region-2/ --region ap-southeast-1
aws s3api put-object --bucket treasury-documents --key region-3/ --region ap-southeast-1
# Add more regions as needed
```

### Configure S3 Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowQBusinessAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "qbusiness.amazonaws.com"
      },
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::treasury-documents",
        "arn:aws:s3:::treasury-documents/*"
      ]
    }
  ]
}
```

## Step 2: IAM Identity Center Setup

### Enable IAM Identity Center
1. Go to IAM Identity Center in AWS Console
2. Choose "Enable" if not already enabled
3. Select "AWS Organizations" as identity source

### Create Permission Sets

#### Regional User Permission Set
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::treasury-documents",
        "arn:aws:s3:::treasury-documents/region-${aws:PrincipalTag/Region}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "qbusiness:Chat",
        "qbusiness:ListConversations",
        "qbusiness:GetConversation"
      ],
      "Resource": "*"
    }
  ]
}
```

#### Regional Admin Permission Set (for S3 Console upload)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::treasury-documents",
        "arn:aws:s3:::treasury-documents/region-${aws:PrincipalTag/Region}/*"
      ]
    }
  ]
}
```

### Create Groups and Users
1. Create groups for each region: `Region-1-Users`, `Region-2-Users`, etc.
2. Create users and assign to appropriate regional groups
3. Add region tag to each user: `Region=1`, `Region=2`, etc.

## Step 3: Amazon Q Business Setup

### Create Q Business Application
```bash
aws qbusiness create-application \
  --display-name "Bureau of Treasury Document Search" \
  --description "AI-powered document search for treasury documents" \
  --region ap-southeast-1
```

### Create Data Source
```bash
aws qbusiness create-data-source \
  --application-id <APPLICATION_ID> \
  --index-id <INDEX_ID> \
  --display-name "Treasury S3 Documents" \
  --type "S3" \
  --configuration '{
    "connectionConfiguration": {
      "repositoryEndpointMetadata": {
        "BucketName": "treasury-documents"
      }
    }
  }' \
  --region ap-southeast-1
```

### Configure Q Business Permissions
1. Go to Q Business console
2. Select your application
3. Configure user access through IAM Identity Center
4. Set up regional access controls

## Step 4: CloudFront Distribution

### Create Distribution
```bash
aws cloudfront create-distribution \
  --distribution-config '{
    "CallerReference": "treasury-docs-'$(date +%s)'",
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Id": "S3-treasury-documents",
          "DomainName": "treasury-documents.s3.ap-southeast-1.amazonaws.com",
          "S3OriginConfig": {
            "OriginAccessIdentity": ""
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-treasury-documents",
      "ViewerProtocolPolicy": "redirect-to-https",
      "TrustedSigners": {
        "Enabled": false,
        "Quantity": 0
      },
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {
          "Forward": "none"
        }
      }
    },
    "Comment": "Bureau of Treasury Documents CDN",
    "Enabled": true
  }'
```

## Step 5: Amplify Setup

### Initialize Amplify Project
```bash
npm install -g @aws-amplify/cli
amplify init
```

### Configure Amplify
```bash
amplify add auth
amplify add hosting
amplify push
```

## Step 6: Environment Variables

Create `.env` file in your project root:
```env
REACT_APP_AWS_REGION=ap-southeast-1
REACT_APP_S3_BUCKET=treasury-documents
REACT_APP_QBUSINESS_APP_ID=<YOUR_QBUSINESS_APP_ID>
REACT_APP_CLOUDFRONT_DOMAIN=<YOUR_CLOUDFRONT_DOMAIN>
```

## Step 7: Testing

### Upload Test Documents
```bash
# Upload sample PDFs to test the system
aws s3 cp sample-document.pdf s3://treasury-documents/region-1/
aws s3 cp another-document.pdf s3://treasury-documents/region-2/
```

### Verify Q Business Processing
1. Go to Q Business console
2. Check data source sync status
3. Test search functionality
4. Verify regional filtering works

## Security Checklist
- [ ] S3 bucket has proper access policies
- [ ] IAM Identity Center is configured with regional permissions
- [ ] Q Business has appropriate user access controls
- [ ] CloudFront is configured for HTTPS only
- [ ] All services are in the same region (ap-southeast-1)
- [ ] Audit logging is enabled via CloudTrail

## Troubleshooting

### Common Issues
1. **Q Business not finding documents**: Check S3 data source sync status
2. **Regional filtering not working**: Verify IAM tags and policies
3. **Slow search performance**: Check CloudFront cache settings
4. **Authentication issues**: Verify IAM Identity Center configuration

### Useful Commands
```bash
# Check S3 bucket contents
aws s3 ls s3://treasury-documents --recursive

# Check Q Business application status
aws qbusiness get-application --application-id <APP_ID>

# View CloudFront distribution
aws cloudfront get-distribution --id <DISTRIBUTION_ID>
```

## Next Steps
After completing this setup, proceed to `DEPLOYMENT-GUIDE.md` to deploy the web application.
