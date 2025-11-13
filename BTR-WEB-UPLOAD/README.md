# Bureau of Treasury - Document Management Web Application

## Overview
This web application provides document search functionality for the Bureau of Treasury with regional filtering capabilities. Users can search through treasury documents using AI-powered search while seeing only documents from their assigned region.

## Architecture
- **Frontend**: React.js with AWS Amplify hosting
- **Authentication**: AWS IAM Identity Center
- **Search**: Amazon Q Business integration
- **Storage**: Amazon S3 with regional folder structure
- **CDN**: Amazon CloudFront for fast file delivery

## Project Structure
```
BTR-WEB-UPLOAD/
├── README.md                    # This file - Project overview
├── COMPLETE-SETUP-GUIDE.md      # 📋 Comprehensive step-by-step setup guide (CLI)
├── CLICKOPS-SETUP-GUIDE.md      # 🖱️ AWS Console (ClickOps) setup guide - NO CLI!
├── QUICK-SETUP-REFERENCE.md     # ⚡ Quick reference and commands cheat sheet
├── LOCAL-DEVELOPMENT.md         # 💻 Local development setup guide
├── DEPLOYMENT-GUIDE.md          # 🚀 Step-by-step deployment instructions
├── AWS-SETUP.md                 # ☁️ AWS services configuration
├── src/                         # React application source code
├── public/                      # Static assets
├── amplify/                     # AWS Amplify configuration
└── docs/                        # Additional documentation
```

## 🚀 Getting Started

### For Complete Setup (Production)

#### Option 1: ClickOps (Recommended for beginners)
**Perfect for users who prefer graphical interfaces:**
👉 **[CLICKOPS-SETUP-GUIDE.md](CLICKOPS-SETUP-GUIDE.md)** - AWS Console setup (NO command line required!)

#### Option 2: CLI Setup (For advanced users)
**For users comfortable with command line:**
👉 **[COMPLETE-SETUP-GUIDE.md](COMPLETE-SETUP-GUIDE.md)** - Comprehensive CLI-based setup guide

### For Quick Reference
**Use this during setup for commands and troubleshooting:**
👉 **[QUICK-SETUP-REFERENCE.md](QUICK-SETUP-REFERENCE.md)** - Commands cheat sheet and quick fixes

## Features
- **Regional Search Filtering**: Users see only documents from their region
- **AI-Powered Search**: Semantic and keyword search capabilities
- **Document Preview**: View documents without downloading
- **Source Citations**: See which documents provided search answers
- **Responsive Design**: Works on desktop and mobile devices
- **Secure Access**: IAM-based authentication and authorization

## Regional Structure
```
S3 Bucket: treasury-documents/
├── region-1/    # Region 1 documents
├── region-2/    # Region 2 documents
├── region-3/    # Region 3 documents
└── ...          # Additional regions
```

## User Roles
- **Regional Users**: Can search and view documents from their assigned region only
- **National Users**: Can search across all regions (optional future feature)

## Quick Start
1. Follow `AWS-SETUP.md` to configure AWS services
2. Follow `DEPLOYMENT-GUIDE.md` to deploy the application
3. Configure user permissions in IAM Identity Center
4. Test with sample documents

## Local Development Setup

### Prerequisites
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### Running Locally
```bash
# 1. Navigate to project folder
cd BTR-WEB-UPLOAD

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

The application will open at: **http://localhost:3000**

### Local Testing Credentials
For local development and testing:
- **Email**: Any format (e.g., `region1@treasury.gov.ph`, `admin@btr.gov.ph`)
- **Password**: Any password (e.g., `password123`, `demo123`)
- **Region**: Automatically detected as "Region 1" for demo

### What You'll See
1. **AWS Amplify Login** - Demo authentication screen
2. **Search Interface** - Bureau of Treasury document search
3. **Mock Data** - Sample treasury documents for testing
4. **Regional Badge** - Shows "Region 1" by default
5. **Search Results** - Simulated Q Business responses

### Development Features
- **Hot Reload** - Changes reflect immediately
- **Mock Data** - No AWS services needed for testing
- **Responsive Design** - Test on different screen sizes
- **Error Handling** - Graceful fallbacks for missing services

### Environment Configuration
The `.env` file contains:
```env
REACT_APP_AWS_REGION=ap-southeast-1
REACT_APP_S3_BUCKET=treasury-documents
REACT_APP_QBUSINESS_APP_ID=demo-app-id
REACT_APP_CLOUDFRONT_DOMAIN=demo.cloudfront.net
REACT_APP_ENABLE_MOCK_DATA=true
```

### Troubleshooting Local Development
- **Port 3000 in use**: The app will prompt to use a different port
- **Dependencies issues**: Run `npm install` again
- **Authentication errors**: Check `src/aws-exports.js` exists
- **Search not working**: Mock data is enabled by default

## Production Deployment

## Cost Estimation
- **Monthly Cost**: ~$651 USD
- **Main Components**: Amazon Q Business ($340), S3 Storage ($161), CloudFront ($85)
- **Scaling**: Costs increase with more users and document volume

## Support
For technical issues or questions, refer to the documentation in the `docs/` folder or contact the AWS Solutions Architecture team.
