# Local Development Guide

## Overview
This guide helps you run the Bureau of Treasury Document Management System locally for development, testing, and demonstration purposes.

## Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended
- **Web Browser** - Chrome, Firefox, Safari, or Edge

## Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/sagesoftcloud/sagesoft-btr.git
cd sagesoft-btr/BTR-WEB-UPLOAD

# Install dependencies
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will automatically open at: **http://localhost:3000**

## Demo Credentials

### For Local Testing
Since this is a **development/demo version**, you can use any credentials:

**Email Examples:**
- `region1@treasury.gov.ph`
- `admin@btr.gov.ph`
- `user@demo.com`
- Any valid email format

**Password Examples:**
- `password123`
- `demo123`
- `treasury2024`
- Any password (minimum 8 characters)

### User Simulation
The system will automatically:
- Assign you to **Region 1** by default
- Show mock treasury documents
- Enable all search features
- Simulate Q Business responses

## Features Available Locally

### ✅ Working Features
- **Authentication Flow** - AWS Amplify UI
- **Search Interface** - Full search functionality
- **Mock Data** - Sample treasury documents
- **Regional Filtering** - Shows Region 1 documents
- **Document Preview** - Simulated file access
- **Responsive Design** - Mobile and desktop views
- **Error Handling** - Graceful fallbacks

### ⚠️ Simulated Features
- **Q Business Integration** - Uses mock responses
- **S3 File Access** - Simulated document URLs
- **IAM Permissions** - Demo user roles
- **CloudFront CDN** - Local file serving

## Development Workflow

### Making Changes
1. **Edit Files** - Changes auto-reload in browser
2. **Check Console** - Browser dev tools for errors
3. **Test Features** - Try different search queries
4. **Mobile Testing** - Resize browser window

### File Structure
```
src/
├── App.js              # Main application
├── components/         # React components
│   ├── SearchBox.js    # Search input
│   └── SearchResults.js # Results display
├── pages/
│   └── SearchPage.js   # Main search page
├── utils/              # Utility functions
│   ├── qbusinessClient.js # Q Business integration
│   ├── userUtils.js    # User management
│   └── fileUtils.js    # File handling
└── aws-exports.js      # AWS configuration
```

### Environment Variables
Located in `.env` file:
```env
# AWS Configuration
REACT_APP_AWS_REGION=ap-southeast-1
REACT_APP_S3_BUCKET=treasury-documents
REACT_APP_QBUSINESS_APP_ID=demo-app-id
REACT_APP_CLOUDFRONT_DOMAIN=demo.cloudfront.net

# Development Settings
REACT_APP_ENABLE_MOCK_DATA=true
```

## Testing Scenarios

### Search Testing
Try these sample queries:
- `"budget allocation 2024"`
- `"infrastructure projects"`
- `"financial reports"`
- `"Republic Act"`
- `"What are the treasury policies?"`

### User Experience Testing
1. **Login Flow** - Test authentication
2. **Search Interface** - Try different queries
3. **Results Display** - Check document listings
4. **File Actions** - Test view/download buttons
5. **Mobile View** - Resize browser window
6. **Error Handling** - Try invalid searches

## Mock Data Details

### Sample Documents
The system includes mock data for:
- **Budget Allocation Report 2024**
- **Infrastructure Development Plan**
- **Financial Audit Report Q1 2024**
- **Treasury Policy Guidelines**
- **Regional Compliance Documents**

### Simulated Features
- **AI Responses** - Pre-written Q Business-style answers
- **Source Citations** - Mock document references
- **File Metadata** - Simulated file sizes and dates
- **Regional Filtering** - Shows only Region 1 content

## Troubleshooting

### Common Issues

#### Port 3000 Already in Use
```bash
# The system will prompt to use a different port
# Choose 'Y' to use port 3001 or another available port
```

#### Dependencies Installation Failed
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Authentication Not Working
```bash
# Check if aws-exports.js exists
ls src/aws-exports.js

# If missing, it should be created automatically
# Or copy from the repository
```

#### Search Returns No Results
- **Check Console** - Look for JavaScript errors
- **Verify Mock Data** - Should be enabled in `.env`
- **Try Different Queries** - Use sample queries above

#### Styling Issues
```bash
# Restart the development server
npm start
```

### Browser Console Errors
Common warnings you can ignore:
- AWS SDK warnings (expected in demo mode)
- Amplify configuration warnings
- Mock data notifications

## Development Tips

### Code Changes
- **Hot Reload** - Changes appear immediately
- **Component Updates** - React components reload automatically
- **Style Changes** - CSS updates instantly
- **Configuration Changes** - May require restart

### Debugging
1. **Browser DevTools** - F12 to open
2. **Console Tab** - Check for errors
3. **Network Tab** - Monitor API calls
4. **React DevTools** - Install browser extension

### Performance
- **Development Mode** - Slower than production
- **Mock Data** - Faster than real AWS calls
- **Local Files** - No network latency

## Next Steps

### For Production Deployment
1. **Follow AWS-SETUP.md** - Configure real AWS services
2. **Follow DEPLOYMENT-GUIDE.md** - Deploy to AWS Amplify
3. **Configure Real Users** - Set up IAM Identity Center
4. **Upload Documents** - Add real treasury files

### For Customization
1. **Modify Components** - Update React components
2. **Change Styling** - Edit CSS files
3. **Add Features** - Extend functionality
4. **Update Mock Data** - Modify sample documents

## Support

### Getting Help
- **Documentation** - Check other .md files
- **Code Comments** - Read inline documentation
- **Console Logs** - Check browser console
- **GitHub Issues** - Report problems

### Resources
- **React Documentation** - https://react.dev/
- **AWS Amplify Docs** - https://docs.amplify.aws/
- **Node.js Docs** - https://nodejs.org/docs/

---

**Happy Development!** 🚀

This local setup provides a complete development environment for the Bureau of Treasury Document Management System without requiring AWS services.
