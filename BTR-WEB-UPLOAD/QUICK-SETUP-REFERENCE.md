# Quick Setup Reference Card

## 🚀 Bureau of Treasury - Setup Commands Cheat Sheet

### Prerequisites Installation
```bash
# Install Node.js 18+ from https://nodejs.org/
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
```

### Phase 1: Local Development (5 minutes)
```bash
git clone https://github.com/sagesoftcloud/sagesoft-btr.git
cd sagesoft-btr/BTR-WEB-UPLOAD
npm install
npm start
# Test login: region1@treasury.gov.ph / password123
```

### Phase 2: AWS S3 Setup (10 minutes)
```bash
# Replace [ACCOUNT-ID] with your AWS account ID
BUCKET_NAME="treasury-documents-[ACCOUNT-ID]"
aws s3 mb s3://$BUCKET_NAME --region ap-southeast-1

# Create regional folders
aws s3api put-object --bucket $BUCKET_NAME --key region-1/ --region ap-southeast-1
aws s3api put-object --bucket $BUCKET_NAME --key region-2/ --region ap-southeast-1
aws s3api put-object --bucket $BUCKET_NAME --key region-3/ --region ap-southeast-1
```

### Phase 3: Q Business Setup (15 minutes)
```bash
# Create Q Business application
aws qbusiness create-application \
  --display-name "Bureau of Treasury Document Search" \
  --description "AI-powered document search for treasury documents" \
  --region ap-southeast-1

# Note the APPLICATION_ID from response, then create index
APPLICATION_ID="your-app-id-here"
aws qbusiness create-index \
  --application-id $APPLICATION_ID \
  --display-name "Treasury Documents Index" \
  --region ap-southeast-1

# Note the INDEX_ID from response, then create data source
INDEX_ID="your-index-id-here"
aws qbusiness create-data-source \
  --application-id $APPLICATION_ID \
  --index-id $INDEX_ID \
  --display-name "Treasury S3 Documents" \
  --type "S3" \
  --configuration '{"connectionConfiguration":{"repositoryEndpointMetadata":{"BucketName":"'$BUCKET_NAME'"}}}' \
  --region ap-southeast-1
```

### Phase 4: Amplify Deployment (10 minutes)
```bash
npm install -g @aws-amplify/cli
amplify configure
amplify init
amplify add auth
amplify add hosting
amplify push
amplify publish
```

## 🔧 Essential Configuration Files

### .env.production
```env
REACT_APP_AWS_REGION=ap-southeast-1
REACT_APP_S3_BUCKET=treasury-documents-[ACCOUNT-ID]
REACT_APP_QBUSINESS_APP_ID=[YOUR-APP-ID]
REACT_APP_CLOUDFRONT_DOMAIN=[YOUR-DOMAIN]
REACT_APP_ENABLE_MOCK_DATA=false
```

### IAM Policy for Regional Access
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::treasury-documents-*",
        "arn:aws:s3:::treasury-documents-*/region-${aws:PrincipalTag/Region}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["qbusiness:Chat", "qbusiness:ListConversations", "qbusiness:GetConversation"],
      "Resource": "*"
    }
  ]
}
```

## 📋 Testing Checklist

### Local Development Test
- [ ] `npm start` works
- [ ] Login with demo credentials works
- [ ] Search returns mock results
- [ ] Regional badge shows "Region 1"

### AWS Services Test
- [ ] S3 bucket created and accessible
- [ ] Q Business application created
- [ ] Data source syncing
- [ ] IAM Identity Center configured

### End-to-End Test
- [ ] Web app deployed and accessible
- [ ] Real user can login
- [ ] File upload to S3 works
- [ ] Search finds uploaded documents
- [ ] Regional filtering works
- [ ] File download works

## 🚨 Common Issues & Quick Fixes

### Q Business not finding documents
```bash
# Check sync status
aws qbusiness get-data-source --application-id $APPLICATION_ID --index-id $INDEX_ID --data-source-id $DATA_SOURCE_ID --region ap-southeast-1

# Restart sync if needed
aws qbusiness start-data-source-sync-job --application-id $APPLICATION_ID --index-id $INDEX_ID --data-source-id $DATA_SOURCE_ID --region ap-southeast-1
```

### Users can't access S3
1. Check IAM Identity Center user tags: `Region=1`
2. Verify permission set assignments
3. Confirm S3 bucket policy allows access

### Web app not loading
```bash
# Check Amplify status
amplify status

# Redeploy if needed
amplify publish
```

## 💰 Cost Monitoring Commands

```bash
# Check S3 storage usage
aws s3 ls s3://$BUCKET_NAME --recursive --human-readable --summarize

# Monitor Q Business usage (via console)
# AWS Console → Q Business → Your App → Usage metrics
```

## 🔗 Important URLs

- **AWS Console**: https://console.aws.amazon.com/
- **IAM Identity Center**: https://console.aws.amazon.com/singlesignon/
- **Q Business Console**: https://console.aws.amazon.com/qbusiness/
- **S3 Console**: https://console.aws.amazon.com/s3/
- **Amplify Console**: https://console.aws.amazon.com/amplify/
- **GitHub Repository**: https://github.com/sagesoftcloud/sagesoft-btr.git

## 📞 Emergency Commands

### Stop all services (cost saving)
```bash
# Pause Q Business data source
aws qbusiness stop-data-source-sync-job --application-id $APPLICATION_ID --index-id $INDEX_ID --data-source-id $DATA_SOURCE_ID --region ap-southeast-1

# Delete Amplify app (if needed)
amplify delete
```

### Restart services
```bash
# Restart Q Business sync
aws qbusiness start-data-source-sync-job --application-id $APPLICATION_ID --index-id $INDEX_ID --data-source-id $DATA_SOURCE_ID --region ap-southeast-1

# Redeploy Amplify app
amplify init
amplify push
amplify publish
```

---

**Total Setup Time**: ~2-3 hours  
**Monthly Cost**: ~$651 USD  
**Users Supported**: 17 regional administrators  
**Storage Capacity**: 7TB+ documents
