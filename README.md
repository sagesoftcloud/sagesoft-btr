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
├── README.md                 # This file
├── DEPLOYMENT-GUIDE.md       # Step-by-step deployment instructions
├── AWS-SETUP.md             # AWS services configuration
├── src/                     # React application source code
├── public/                  # Static assets
├── amplify/                 # AWS Amplify configuration
└── docs/                    # Additional documentation
```

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

## Cost Estimation
- **Monthly Cost**: ~$651 USD
- **Main Components**: Amazon Q Business ($340), S3 Storage ($161), CloudFront ($85)
- **Scaling**: Costs increase with more users and document volume

## Support
For technical issues or questions, refer to the documentation in the `docs/` folder or contact the AWS Solutions Architecture team.
