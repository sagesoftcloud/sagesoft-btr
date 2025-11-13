# Bureau of Treasury - Complete Setup Guide

## Overview
This guide will walk you through setting up the complete Bureau of Treasury Document Management System from scratch. Follow each step carefully to ensure a successful deployment.

## Prerequisites Checklist

### Required Software
- [ ] **AWS Account** with administrative access
- [ ] **Node.js 18+** - [Download here](https://nodejs.org/)
- [ ] **Git** - [Download here](https://git-scm.com/)
- [ ] **AWS CLI** - [Installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [ ] **Code Editor** (VS Code recommended)

### Required Information
- [ ] **AWS Account ID**
- [ ] **Region preference** (we'll use ap-southeast-1)
- [ ] **List of regions** for Bureau of Treasury (Region 1, 2, 3, etc.)
- [ ] **Regional administrator emails**

---

## Phase 1: Local Development Setup (30 minutes)

### Step 1.1: Clone the Repository
```bash
# Clone the project
git clone https://github.com/sagesoftcloud/sagesoft-btr.git
cd sagesoft-btr/BTR-WEB-UPLOAD

# Install dependencies
npm install
```

### Step 1.2: Test Local Development
```bash
# Start the development server
npm start
```

**Expected Result**: Browser opens to http://localhost:3000 showing the Bureau of Treasury login page.

### Step 1.3: Test Demo Login
- **Email**: `region1@treasury.gov.ph`
- **Password**: `password123`

**Expected Result**: You should see the search interface with "Region 1" badge.

### Step 1.4: Test Search Functionality
Try these sample searches:
- `"budget allocation 2024"`
- `"infrastructure projects"`
- `"What are the treasury policies?"`

**Expected Result**: Mock search results should appear with sample documents.

✅ **Checkpoint**: Local development is working if you can login and see search results.

---

## Phase 2: AWS Account Setup (45 minutes)

### Step 2.1: Configure AWS CLI
```bash
# Configure AWS CLI with your credentials
aws configure

# Enter when prompted:
# AWS Access Key ID: [Your access key]
# AWS Secret Access Key: [Your secret key]
# Default region name: ap-southeast-1
# Default output format: json
```

### Step 2.2: Verify AWS Access
```bash
# Test AWS connection
aws sts get-caller-identity
```

**Expected Result**: Should return your AWS account details.

### Step 2.3: Create S3 Bucket
```bash
# Create the main document bucket
aws s3 mb s3://treasury-documents-[YOUR-ACCOUNT-ID] --region ap-southeast-1

# Example: aws s3 mb s3://treasury-documents-123456789012 --region ap-southeast-1
```

### Step 2.4: Create Regional Folders
```bash
# Replace [BUCKET-NAME] with your actual bucket name
BUCKET_NAME="treasury-documents-[YOUR-ACCOUNT-ID]"

# Create folders for each region
aws s3api put-object --bucket $BUCKET_NAME --key region-1/ --region ap-southeast-1
aws s3api put-object --bucket $BUCKET_NAME --key region-2/ --region ap-southeast-1
aws s3api put-object --bucket $BUCKET_NAME --key region-3/ --region ap-southeast-1
# Add more regions as needed
```

### Step 2.5: Upload Test Documents
```bash
# Create a test PDF (or use existing ones)
echo "This is a test treasury document for Region 1" > test-document.txt

# Upload test files
aws s3 cp test-document.txt s3://$BUCKET_NAME/region-1/sample-budget-report.pdf
aws s3 cp test-document.txt s3://$BUCKET_NAME/region-2/sample-audit-report.pdf
```

✅ **Checkpoint**: Verify files are uploaded by checking AWS S3 Console.

---

## Phase 3: IAM Identity Center Setup (60 minutes)

### Step 3.1: Enable IAM Identity Center
1. Go to **AWS Console** → **IAM Identity Center**
2. Click **"Enable"** if not already enabled
3. Choose **"AWS Organizations"** as identity source
4. Note down the **Identity Center URL** (you'll need this later)

### Step 3.2: Create Permission Sets

#### Regional Admin Permission Set
1. Go to **Permission sets** → **Create permission set**
2. **Name**: `TreasuryRegionalAdmin`
3. **Session duration**: 8 hours
4. **Inline policy**: Copy and paste this JSON:

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
        "arn:aws:s3:::treasury-documents-*",
        "arn:aws:s3:::treasury-documents-*/region-${aws:PrincipalTag/Region}/*"
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

#### Regional User Permission Set
1. Create another permission set: `TreasuryRegionalUser`
2. **Inline policy**:

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
        "arn:aws:s3:::treasury-documents-*",
        "arn:aws:s3:::treasury-documents-*/region-${aws:PrincipalTag/Region}/*"
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

### Step 3.3: Create Groups
1. Go to **Groups** → **Create group**
2. Create these groups:
   - `Region-1-Admins`
   - `Region-2-Admins`
   - `Region-3-Admins`
   - (Add more as needed)

### Step 3.4: Create Users
1. Go to **Users** → **Add user**
2. Create test users:
   - **Username**: `region1-admin`
   - **Email**: `region1@treasury.gov.ph`
   - **First name**: `Region 1`
   - **Last name**: `Administrator`

3. **Add to group**: `Region-1-Admins`
4. **Add tags**: 
   - Key: `Region`, Value: `1`

5. Repeat for other regions

### Step 3.5: Assign Permission Sets
1. Go to **AWS accounts** → Select your account
2. **Assign users or groups**
3. Select `Region-1-Admins` group
4. Assign `TreasuryRegionalAdmin` permission set
5. Repeat for all regional groups

✅ **Checkpoint**: Users should receive email invitations to set passwords.

---

## Phase 4: Amazon Q Business Setup (90 minutes)

### Step 4.1: Create Q Business Application
```bash
# Create Q Business application
aws qbusiness create-application \
  --display-name "Bureau of Treasury Document Search" \
  --description "AI-powered document search for treasury documents" \
  --region ap-southeast-1
```

**Note down the Application ID** from the response.

### Step 4.2: Create Index
```bash
# Replace [APPLICATION-ID] with the ID from previous step
APPLICATION_ID="your-application-id-here"

aws qbusiness create-index \
  --application-id $APPLICATION_ID \
  --display-name "Treasury Documents Index" \
  --region ap-southeast-1
```

**Note down the Index ID** from the response.

### Step 4.3: Create Data Source
```bash
# Replace [APPLICATION-ID] and [INDEX-ID] with actual values
INDEX_ID="your-index-id-here"
BUCKET_NAME="treasury-documents-[YOUR-ACCOUNT-ID]"

aws qbusiness create-data-source \
  --application-id $APPLICATION_ID \
  --index-id $INDEX_ID \
  --display-name "Treasury S3 Documents" \
  --type "S3" \
  --configuration '{
    "connectionConfiguration": {
      "repositoryEndpointMetadata": {
        "BucketName": "'$BUCKET_NAME'"
      }
    }
  }' \
  --region ap-southeast-1
```

### Step 4.4: Configure Q Business IAM Role
1. Go to **AWS Console** → **IAM** → **Roles**
2. Find the Q Business service role (created automatically)
3. Add this policy to allow S3 access:

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
        "arn:aws:s3:::treasury-documents-*",
        "arn:aws:s3:::treasury-documents-*/*"
      ]
    }
  ]
}
```

### Step 4.5: Start Data Source Sync
```bash
# Replace with your actual IDs
DATA_SOURCE_ID="your-data-source-id-here"

aws qbusiness start-data-source-sync-job \
  --application-id $APPLICATION_ID \
  --index-id $INDEX_ID \
  --data-source-id $DATA_SOURCE_ID \
  --region ap-southeast-1
```

### Step 4.6: Configure User Access
1. Go to **Q Business Console** → Your application
2. Go to **User access** → **Add users and groups**
3. Select **IAM Identity Center**
4. Add the regional groups you created
5. Assign appropriate permissions

✅ **Checkpoint**: Data source should show "Syncing" status in Q Business console.

---

## Phase 5: CloudFront Setup (30 minutes)

### Step 5.1: Create CloudFront Distribution
```bash
# Create CloudFront distribution for fast file access
aws cloudfront create-distribution \
  --distribution-config '{
    "CallerReference": "treasury-docs-'$(date +%s)'",
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Id": "S3-treasury-documents",
          "DomainName": "'$BUCKET_NAME'.s3.ap-southeast-1.amazonaws.com",
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
  }' \
  --region ap-southeast-1
```

**Note down the CloudFront Domain Name** from the response.

✅ **Checkpoint**: CloudFront distribution should be "In Progress" status.

---

## Phase 6: Web Application Deployment (45 minutes)

### Step 6.1: Install Amplify CLI
```bash
# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure
```

Follow the prompts to configure Amplify with your AWS credentials.

### Step 6.2: Initialize Amplify Project
```bash
# In the BTR-WEB-UPLOAD directory
cd BTR-WEB-UPLOAD
amplify init
```

**Configuration:**
- Project name: `bureau-treasury-docs`
- Environment: `prod`
- Default editor: `Visual Studio Code`
- App type: `javascript`
- Framework: `react`
- Source directory: `src`
- Build command: `npm run build`
- Start command: `npm start`

### Step 6.3: Add Authentication
```bash
amplify add auth
```

**Configuration:**
- Use default configuration: `Yes`
- Username attributes: `Email`
- Advanced settings: `No`

### Step 6.4: Add Hosting
```bash
amplify add hosting
```

**Configuration:**
- Select: `Amazon CloudFront and S3`
- Hosting bucket name: Accept default

### Step 6.5: Update Environment Variables
Create `.env.production` file:
```env
REACT_APP_AWS_REGION=ap-southeast-1
REACT_APP_S3_BUCKET=treasury-documents-[YOUR-ACCOUNT-ID]
REACT_APP_QBUSINESS_APP_ID=[YOUR-QBUSINESS-APP-ID]
REACT_APP_CLOUDFRONT_DOMAIN=[YOUR-CLOUDFRONT-DOMAIN]
REACT_APP_ENABLE_MOCK_DATA=false
```

### Step 6.6: Deploy Application
```bash
# Build and deploy
amplify push

# Publish to hosting
amplify publish
```

**Expected Result**: You'll get a URL where your application is hosted.

✅ **Checkpoint**: Web application should be accessible via the provided URL.

---

## Phase 7: Testing & Validation (30 minutes)

### Step 7.1: Test Regional Admin Upload
1. **Login to AWS S3 Console** as regional admin
2. **Navigate** to your S3 bucket
3. **Upload a PDF** to region-1/ folder
4. **Wait 5-10 minutes** for Q Business to process

### Step 7.2: Test Web Application
1. **Open** the Amplify-hosted URL
2. **Login** with regional admin credentials
3. **Search** for content from the uploaded PDF
4. **Verify** regional filtering works

### Step 7.3: Test File Download
1. **Search** for a document
2. **Click "View"** button
3. **Verify** file opens via CloudFront URL
4. **Test "Download"** functionality

### Step 7.4: Test Multiple Regions
1. **Create users** for different regions
2. **Upload files** to different regional folders
3. **Verify** each user sees only their region's documents

✅ **Checkpoint**: All functionality should work end-to-end.

---

## Phase 8: Production Configuration (60 minutes)

### Step 8.1: Configure Custom Domain (Optional)
```bash
# Add custom domain to Amplify
amplify add hosting
# Select: Add a custom domain
```

### Step 8.2: Set Up Monitoring
1. **CloudWatch Alarms**:
   - Q Business sync failures
   - S3 upload errors
   - Application errors

2. **Cost Monitoring**:
   - Set up billing alerts
   - Monitor Q Business usage

### Step 8.3: Security Hardening
1. **Enable AWS WAF** for the web application
2. **Configure HTTPS** redirects
3. **Set up proper CORS** policies
4. **Review IAM policies** for least privilege

### Step 8.4: Backup Configuration
1. **S3 Cross-Region Replication**
2. **Q Business data export** procedures
3. **Configuration backup** (CloudFormation templates)

### Step 8.5: User Training Materials
1. **Create user guides** for regional admins
2. **Record demo videos** for search functionality
3. **Prepare troubleshooting** documentation

---

## Phase 9: Go-Live Checklist

### Pre-Launch Checklist
- [ ] All AWS services are configured and running
- [ ] Test users can login and access their regions
- [ ] File upload and search functionality works
- [ ] Regional filtering is properly enforced
- [ ] CloudFront is serving files correctly
- [ ] Monitoring and alerts are configured
- [ ] Backup procedures are in place
- [ ] User training is completed

### Launch Day Tasks
- [ ] **Communicate** go-live to all users
- [ ] **Monitor** system performance closely
- [ ] **Be available** for immediate support
- [ ] **Document** any issues and resolutions

### Post-Launch Tasks (First Week)
- [ ] **Daily monitoring** of system health
- [ ] **User feedback** collection
- [ ] **Performance optimization** based on usage
- [ ] **Cost monitoring** and optimization

---

## Troubleshooting Common Issues

### Issue: Q Business not finding documents
**Solution:**
1. Check data source sync status
2. Verify S3 bucket permissions
3. Ensure files are in correct format (PDF)
4. Wait for full sync completion (can take hours)

### Issue: Users can't login
**Solution:**
1. Verify IAM Identity Center configuration
2. Check user group assignments
3. Confirm permission set assignments
4. Verify user has accepted invitation

### Issue: Regional filtering not working
**Solution:**
1. Check user tags in IAM Identity Center
2. Verify IAM policies use correct variables
3. Test with different user accounts
4. Check application-level filtering logic

### Issue: Files not downloading
**Solution:**
1. Verify CloudFront distribution is deployed
2. Check S3 bucket policies
3. Confirm CORS configuration
4. Test direct S3 URLs first

### Issue: High costs
**Solution:**
1. Monitor Q Business usage
2. Optimize S3 storage classes
3. Review CloudFront usage patterns
4. Consider data lifecycle policies

---

## Maintenance Schedule

### Daily
- [ ] Monitor system health dashboards
- [ ] Check error logs
- [ ] Verify backup completion

### Weekly
- [ ] Review cost reports
- [ ] Check user access patterns
- [ ] Update security patches

### Monthly
- [ ] Performance optimization review
- [ ] User feedback analysis
- [ ] Capacity planning review
- [ ] Security audit

### Quarterly
- [ ] Full system backup test
- [ ] Disaster recovery drill
- [ ] User training refresh
- [ ] Cost optimization review

---

## Support Contacts

### Technical Issues
- **AWS Support**: Use your AWS support plan
- **Application Issues**: Check GitHub repository issues
- **Emergency Contact**: [Your IT team contact]

### Business Issues
- **User Access**: Regional IT administrators
- **Content Issues**: Regional document managers
- **Policy Questions**: Bureau of Treasury IT governance

---

## Cost Monitoring

### Expected Monthly Costs
- **Amazon Q Business**: $340 (17 users × $20/user)
- **Amazon S3**: $161 (7TB storage)
- **CloudFront**: $85 (1TB data transfer)
- **Amplify Hosting**: $15
- **Data Transfer**: $50
- **Total**: ~$651 USD/month

### Cost Optimization Tips
1. **Use S3 Intelligent Tiering** for infrequently accessed files
2. **Monitor Q Business usage** and adjust user count
3. **Optimize CloudFront** caching policies
4. **Regular cleanup** of old documents

---

## Success Metrics

### Technical Metrics
- **System Uptime**: >99.9%
- **Search Response Time**: <3 seconds
- **Document Processing Time**: <5 minutes
- **User Login Success Rate**: >95%

### Business Metrics
- **User Adoption Rate**: >90% within 3 months
- **Search Success Rate**: >85% of searches find relevant results
- **Time Saved**: 80% reduction in document search time
- **User Satisfaction**: >85% positive feedback

---

**Congratulations!** 🎉 

You have successfully set up the complete Bureau of Treasury Document Management System. The system is now ready for production use with AI-powered search, regional access control, and secure document management.

For ongoing support and updates, refer to the GitHub repository and AWS documentation.
