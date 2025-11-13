# Bureau of Treasury - ClickOps Setup Guide (AWS Console)

## Overview
This guide uses the AWS Console (ClickOps) instead of command line tools. Perfect for users who prefer graphical interfaces over CLI commands.

## Prerequisites
- [ ] **AWS Account** with administrative access
- [ ] **Web Browser** (Chrome, Firefox, Safari, or Edge)
- [ ] **Email access** for user invitations
- [ ] **Node.js 18+** for local development testing

---

## Phase 1: Local Development Test (15 minutes)

### Step 1.1: Download the Project
1. **Go to**: https://github.com/sagesoftcloud/sagesoft-btr.git
2. **Click**: "Code" → "Download ZIP"
3. **Extract** the ZIP file to your computer
4. **Open Terminal/Command Prompt** and navigate to `BTR-WEB-UPLOAD` folder

### Step 1.2: Test Locally
```bash
npm install
npm start
```

**Test Login**: `region1@treasury.gov.ph` / `password123`

✅ **Checkpoint**: You should see the Bureau of Treasury interface with search functionality.

---

## Phase 2: AWS S3 Setup (20 minutes)

### Step 2.1: Create S3 Bucket
1. **Login** to AWS Console: https://console.aws.amazon.com/
2. **Go to**: S3 service
3. **Click**: "Create bucket"
4. **Bucket name**: `treasury-documents-[your-account-id]`
   - Example: `treasury-documents-123456789012`
5. **Region**: Asia Pacific (Singapore) ap-southeast-1
6. **Block Public Access**: Keep all checkboxes checked (default)
7. **Bucket Versioning**: Enable
8. **Default encryption**: Enable with Amazon S3 managed keys (SSE-S3)
9. **Click**: "Create bucket"

### Step 2.2: Create Regional Folders
1. **Open** your newly created bucket
2. **Click**: "Create folder"
3. **Folder name**: `region-1`
4. **Click**: "Create folder"
5. **Repeat** for `region-2`, `region-3`, etc.

### Step 2.3: Upload Test Documents
1. **Go into** `region-1` folder
2. **Click**: "Upload"
3. **Add files**: Upload a sample PDF file
4. **Rename** it to something like `sample-budget-report-2024.pdf`
5. **Click**: "Upload"
6. **Repeat** for other regions with different files

✅ **Checkpoint**: You should see folders and files in your S3 bucket.

---

## Phase 3: IAM Identity Center Setup (45 minutes)

### Step 3.1: Enable IAM Identity Center
1. **Go to**: IAM Identity Center service
2. **Click**: "Enable" (if not already enabled)
3. **Choose**: "AWS Organizations" as identity source
4. **Note down** the Identity Center URL (you'll need this later)

### Step 3.2: Create Permission Sets

#### Create Regional Admin Permission Set
1. **Go to**: "Permission sets" in left menu
2. **Click**: "Create permission set"
3. **Name**: `TreasuryRegionalAdmin`
4. **Description**: `Regional administrators for Bureau of Treasury`
5. **Session duration**: 8 hours
6. **Click**: "Next"
7. **Select**: "Create a custom permission set"
8. **Click**: "Next"
9. **Inline policy**: Click "Create inline policy"
10. **Switch to JSON tab** and paste:

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

11. **Click**: "Review policy"
12. **Policy name**: `TreasuryRegionalAccess`
13. **Click**: "Create policy"
14. **Click**: "Next" → "Create"

#### Create Regional User Permission Set
1. **Repeat** the above process with:
2. **Name**: `TreasuryRegionalUser`
3. **Same JSON policy** (users will have same access for now)

### Step 3.3: Create Groups
1. **Go to**: "Groups" in left menu
2. **Click**: "Create group"
3. **Group name**: `Region-1-Admins`
4. **Description**: `Administrators for Region 1`
5. **Click**: "Create group"
6. **Repeat** for:
   - `Region-2-Admins`
   - `Region-3-Admins`
   - (Add more regions as needed)

### Step 3.4: Create Users
1. **Go to**: "Users" in left menu
2. **Click**: "Add user"
3. **Username**: `region1-admin`
4. **Email**: `region1@treasury.gov.ph` (use real email)
5. **First name**: `Region 1`
6. **Last name**: `Administrator`
7. **Click**: "Next"
8. **Add to groups**: Select `Region-1-Admins`
9. **Click**: "Next"
10. **Add tags**:
    - **Key**: `Region`
    - **Value**: `1`
11. **Click**: "Add user"

**Repeat** for other regions:
- `region2-admin` → `Region-2-Admins` → Tag: `Region=2`
- `region3-admin` → `Region-3-Admins` → Tag: `Region=3`

### Step 3.5: Assign Permission Sets to Groups
1. **Go to**: "AWS accounts" in left menu
2. **Select** your AWS account
3. **Click**: "Assign users or groups"
4. **Select**: "Groups" tab
5. **Choose**: `Region-1-Admins`
6. **Click**: "Next"
7. **Select**: `TreasuryRegionalAdmin` permission set
8. **Click**: "Next" → "Submit"
9. **Repeat** for all regional groups

✅ **Checkpoint**: Users should receive email invitations to set their passwords.

---

## Phase 4: Amazon Q Business Setup (60 minutes)

### Step 4.1: Create Q Business Application
1. **Go to**: Amazon Q Business service
2. **Click**: "Create application"
3. **Application name**: `Bureau of Treasury Document Search`
4. **Description**: `AI-powered document search for treasury documents`
5. **Service access role**: Create new role
6. **Click**: "Create"
7. **Note down** the Application ID

### Step 4.2: Create Index
1. **In your Q Business application**, click "Indexes"
2. **Click**: "Create index"
3. **Index name**: `Treasury Documents Index`
4. **Description**: `Index for all treasury documents`
5. **Click**: "Create"
6. **Note down** the Index ID

### Step 4.3: Create Data Source
1. **Click**: "Data sources" in your application
2. **Click**: "Add data source"
3. **Select**: "Amazon S3"
4. **Data source name**: `Treasury S3 Documents`
5. **Description**: `Treasury documents from S3 bucket`
6. **S3 bucket**: Select your `treasury-documents-*` bucket
7. **Include patterns**: Leave empty (include all)
8. **Exclude patterns**: Leave empty
9. **Additional settings**: Keep defaults
10. **Click**: "Add data source"

### Step 4.4: Configure Data Source Sync
1. **In your data source**, click "Sync now"
2. **Sync frequency**: Daily
3. **Click**: "Start sync"
4. **Wait** for sync to complete (can take 30-60 minutes)

### Step 4.5: Configure User Access
1. **Go to**: "User access" in your Q Business application
2. **Click**: "Add users and groups"
3. **Select**: "IAM Identity Center"
4. **Choose**: Your Identity Center instance
5. **Add groups**: Select all your regional groups
6. **Assign permissions**: Choose appropriate access level
7. **Click**: "Add"

✅ **Checkpoint**: Data source should show "Syncing" or "Completed" status.

---

## Phase 5: CloudFront Setup (30 minutes)

### Step 5.1: Create CloudFront Distribution
1. **Go to**: CloudFront service
2. **Click**: "Create distribution"
3. **Origin domain**: Select your S3 bucket from dropdown
4. **Origin path**: Leave empty
5. **Origin access**: "Origin access control settings (recommended)"
6. **Create control setting**: Click "Create control setting"
   - **Name**: `treasury-documents-oac`
   - **Click**: "Create"
7. **Viewer protocol policy**: "Redirect HTTP to HTTPS"
8. **Allowed HTTP methods**: "GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE"
9. **Cache policy**: "Managed-CachingOptimized"
10. **Origin request policy**: "Managed-CORS-S3Origin"
11. **Click**: "Create distribution"
12. **Note down** the CloudFront domain name

### Step 5.2: Update S3 Bucket Policy
1. **Go back to S3** → Your bucket
2. **Click**: "Permissions" tab
3. **Bucket policy**: Click "Edit"
4. **Paste this policy** (replace `DISTRIBUTION-ID` and `BUCKET-NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET-NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT-ID:distribution/DISTRIBUTION-ID"
        }
      }
    }
  ]
}
```

5. **Click**: "Save changes"

✅ **Checkpoint**: CloudFront distribution should be "Deployed" (takes 15-20 minutes).

---

## Phase 6: Web Application Deployment (45 minutes)

### Step 6.1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

**Follow the prompts** to configure Amplify with your AWS credentials.

### Step 6.2: Initialize Amplify Project
```bash
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

### Step 6.4: Add Hosting
```bash
amplify add hosting
```

**Configuration:**
- Select: `Amazon CloudFront and S3`

### Step 6.5: Update Environment Variables
**Create** `.env.production` file:
```env
REACT_APP_AWS_REGION=ap-southeast-1
REACT_APP_S3_BUCKET=treasury-documents-[YOUR-ACCOUNT-ID]
REACT_APP_QBUSINESS_APP_ID=[YOUR-QBUSINESS-APP-ID]
REACT_APP_CLOUDFRONT_DOMAIN=[YOUR-CLOUDFRONT-DOMAIN]
REACT_APP_ENABLE_MOCK_DATA=false
```

### Step 6.6: Deploy Application
```bash
amplify push
amplify publish
```

✅ **Checkpoint**: You'll get a URL where your application is hosted.

---

## Phase 7: Testing Everything (30 minutes)

### Step 7.1: Test Regional Admin S3 Access
1. **Login** to AWS Console as regional admin
2. **Go to**: S3 service
3. **Try to access**: Your treasury documents bucket
4. **Upload a PDF** to your region's folder
5. **Verify**: You can only see your region's folder

### Step 7.2: Test Web Application
1. **Open** the Amplify-hosted URL
2. **Login** with regional admin credentials
3. **Search** for content from uploaded PDFs
4. **Verify**: Regional filtering works (only see your region's documents)

### Step 7.3: Test Q Business Integration
1. **Try different search queries**:
   - "budget allocation"
   - "What are the infrastructure projects?"
   - "Show me financial reports"
2. **Verify**: Results come from your uploaded documents
3. **Check**: Source citations appear correctly

### Step 7.4: Test File Access
1. **Click "View"** on a search result
2. **Verify**: File opens via CloudFront URL
3. **Test "Download"** functionality
4. **Check**: Files download correctly

✅ **Checkpoint**: All functionality should work end-to-end.

---

## Phase 8: Production Setup (Optional)

### Step 8.1: Custom Domain (Optional)
1. **In Amplify Console**: Go to your app
2. **Click**: "Domain management"
3. **Add domain**: Enter your custom domain
4. **Follow**: DNS configuration instructions

### Step 8.2: Monitoring Setup
1. **Go to**: CloudWatch service
2. **Create alarms** for:
   - Q Business sync failures
   - S3 upload errors
   - Application errors
3. **Set up**: SNS notifications for alerts

### Step 8.3: Cost Monitoring
1. **Go to**: Billing and Cost Management
2. **Set up**: Budget alerts
3. **Monitor**: Q Business usage
4. **Track**: Monthly costs

---

## Troubleshooting Common Issues

### Q Business Not Finding Documents
1. **Check**: Data source sync status in Q Business console
2. **Verify**: S3 bucket permissions allow Q Business access
3. **Wait**: Full sync can take 1-2 hours for large document sets
4. **Retry**: Manual sync if needed

### Users Can't Login
1. **Check**: IAM Identity Center user status
2. **Verify**: Users accepted email invitations
3. **Confirm**: Permission sets are assigned to groups
4. **Test**: With a different user account

### Regional Filtering Not Working
1. **Verify**: User tags are set correctly (`Region=1`)
2. **Check**: IAM policies use correct tag variables
3. **Test**: Application-level filtering logic
4. **Debug**: Check browser console for errors

### Files Not Downloading
1. **Verify**: CloudFront distribution is deployed
2. **Check**: S3 bucket policy allows CloudFront access
3. **Test**: Direct S3 URLs first
4. **Confirm**: CORS configuration is correct

---

## Success Checklist

### Pre-Launch
- [ ] All AWS services configured via console
- [ ] Test users can login and access correct regions
- [ ] File upload to S3 works for regional admins
- [ ] Q Business finds and indexes uploaded documents
- [ ] Web application search returns relevant results
- [ ] Regional filtering prevents cross-region access
- [ ] CloudFront serves files quickly
- [ ] Monitoring and alerts configured

### Post-Launch
- [ ] Monitor system performance daily
- [ ] Collect user feedback
- [ ] Optimize based on usage patterns
- [ ] Regular security reviews
- [ ] Cost optimization reviews

---

## Monthly Maintenance Tasks

### Via AWS Console
1. **Check**: Q Business usage and costs
2. **Review**: S3 storage usage and optimize
3. **Monitor**: CloudFront performance metrics
4. **Update**: User access as needed
5. **Review**: Security and compliance

### Cost Optimization
1. **Use**: S3 Intelligent Tiering for old files
2. **Monitor**: Q Business user count
3. **Optimize**: CloudFront caching policies
4. **Clean up**: Unused resources

---

**Congratulations!** 🎉

You've successfully set up the Bureau of Treasury Document Management System using only the AWS Console (ClickOps). The system is now ready for production use with AI-powered search, regional access control, and secure document management.

**Total Setup Time**: 3-4 hours using AWS Console  
**Monthly Cost**: ~$651 USD  
**No CLI Required**: Everything done through web interfaces!
