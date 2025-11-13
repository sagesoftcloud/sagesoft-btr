# Deployment Guide - Bureau of Treasury Web Application

## Prerequisites
- Complete AWS setup from `AWS-SETUP.md`
- Node.js 18+ installed
- AWS CLI configured
- Git installed

## Step 1: Project Setup

### Clone and Initialize
```bash
cd BTR-WEB-UPLOAD
npm init -y
npm install react react-dom react-scripts
npm install @aws-amplify/ui-react aws-amplify
npm install @aws-sdk/client-s3 @aws-sdk/client-qbusiness
npm install react-router-dom axios
```

### Create Project Structure
```bash
mkdir -p src/components src/pages src/utils src/styles
mkdir -p public amplify docs
```

## Step 2: Configure Amplify

### Initialize Amplify
```bash
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

### Add Authentication
```bash
amplify add auth
```

**Configuration:**
- Use default configuration
- Username attributes: `Email`
- Advanced settings: `No`

### Add Hosting
```bash
amplify add hosting
```

**Configuration:**
- Select: `Amazon CloudFront and S3`
- Hosting bucket name: Accept default

## Step 3: Application Development

### Main App Component
```javascript
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import SearchPage from './pages/SearchPage';
import './App.css';

Amplify.configure(awsconfig);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          <header className="app-header">
            <h1>Bureau of Treasury - Document Search</h1>
            <div className="user-info">
              <span>Welcome, {user.username}</span>
              <button onClick={signOut}>Sign Out</button>
            </div>
          </header>
          <Router>
            <Routes>
              <Route path="/" element={<SearchPage user={user} />} />
            </Routes>
          </Router>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
```

### Search Page Component
```javascript
// src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import { searchDocuments } from '../utils/qbusinessClient';
import { getUserRegion } from '../utils/userUtils';

const SearchPage = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRegion, setUserRegion] = useState(null);

  useEffect(() => {
    // Get user's region from IAM tags or user attributes
    const region = getUserRegion(user);
    setUserRegion(region);
  }, [user]);

  const handleSearch = async (query) => {
    setLoading(true);
    setSearchQuery(query);
    
    try {
      const results = await searchDocuments(query);
      // Filter results by user's region
      const filteredResults = results.filter(result => 
        result.source.includes(`/region-${userRegion}/`)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <SearchBox onSearch={handleSearch} loading={loading} />
        {userRegion && (
          <div className="region-info">
            Searching in: Region {userRegion}
          </div>
        )}
        <SearchResults 
          results={searchResults} 
          query={searchQuery}
          userRegion={userRegion}
        />
      </div>
    </div>
  );
};

export default SearchPage;
```

### Search Box Component
```javascript
// src/components/SearchBox.js
import React, { useState } from 'react';

const SearchBox = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-box">
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search treasury documents..."
          className="search-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
```

### Search Results Component
```javascript
// src/components/SearchResults.js
import React from 'react';
import { getCloudFrontUrl } from '../utils/fileUtils';

const SearchResults = ({ results, query, userRegion }) => {
  if (!query) {
    return (
      <div className="search-placeholder">
        <h3>Search Treasury Documents</h3>
        <p>Enter keywords to search through Region {userRegion} documents</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="no-results">
        <h3>No documents found</h3>
        <p>Try different keywords or check document availability</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <h3>Search Results ({results.length})</h3>
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <div className="result-header">
            <h4>{result.title}</h4>
            <span className="result-source">Region {userRegion}</span>
          </div>
          <p className="result-excerpt">{result.excerpt}</p>
          <div className="result-actions">
            <button 
              onClick={() => window.open(getCloudFrontUrl(result.source), '_blank')}
              className="view-button"
            >
              View Document
            </button>
            <button 
              onClick={() => downloadDocument(result.source)}
              className="download-button"
            >
              Download
            </button>
          </div>
          {result.citations && (
            <div className="citations">
              <strong>Sources:</strong> {result.citations.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const downloadDocument = (source) => {
  const cloudFrontUrl = getCloudFrontUrl(source);
  const link = document.createElement('a');
  link.href = cloudFrontUrl;
  link.download = source.split('/').pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default SearchResults;
```

## Step 4: Utility Functions

### Q Business Client
```javascript
// src/utils/qbusinessClient.js
import { QBusinessClient, ChatCommand } from '@aws-sdk/client-qbusiness';

const qbusinessClient = new QBusinessClient({
  region: process.env.REACT_APP_AWS_REGION,
});

export const searchDocuments = async (query) => {
  try {
    const command = new ChatCommand({
      applicationId: process.env.REACT_APP_QBUSINESS_APP_ID,
      userMessage: query,
    });

    const response = await qbusinessClient.send(command);
    
    // Process Q Business response to extract search results
    return processQBusinessResponse(response);
  } catch (error) {
    console.error('Q Business search error:', error);
    throw error;
  }
};

const processQBusinessResponse = (response) => {
  // Transform Q Business response to search results format
  const results = [];
  
  if (response.sourceAttributions) {
    response.sourceAttributions.forEach((attribution, index) => {
      results.push({
        title: attribution.title || `Document ${index + 1}`,
        excerpt: attribution.snippet || '',
        source: attribution.url || '',
        citations: [attribution.title],
        relevanceScore: attribution.score || 0
      });
    });
  }
  
  return results;
};
```

### User Utilities
```javascript
// src/utils/userUtils.js
export const getUserRegion = (user) => {
  // Extract region from user attributes or IAM tags
  // This would be configured based on your IAM Identity Center setup
  
  // Example: Extract from user groups
  if (user.signInUserSession?.accessToken?.payload?.['cognito:groups']) {
    const groups = user.signInUserSession.accessToken.payload['cognito:groups'];
    const regionGroup = groups.find(group => group.startsWith('Region-'));
    if (regionGroup) {
      return regionGroup.split('-')[1];
    }
  }
  
  // Fallback: Extract from username or email
  const username = user.username || user.attributes?.email || '';
  const regionMatch = username.match(/region-?(\d+)/i);
  return regionMatch ? regionMatch[1] : '1';
};
```

### File Utilities
```javascript
// src/utils/fileUtils.js
export const getCloudFrontUrl = (s3Path) => {
  const cloudFrontDomain = process.env.REACT_APP_CLOUDFRONT_DOMAIN;
  // Remove s3://bucket-name/ prefix if present
  const cleanPath = s3Path.replace(/^s3:\/\/[^\/]+\//, '');
  return `https://${cloudFrontDomain}/${cleanPath}`;
};

export const getFileIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    default:
      return '📋';
  }
};
```

## Step 5: Styling

### Main CSS
```css
/* src/App.css */
.App {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.app-header {
  background-color: #1e3a8a;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-box {
  margin-bottom: 2rem;
}

.search-input-container {
  display: flex;
  gap: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  font-size: 1rem;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.search-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.region-info {
  background-color: #dbeafe;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.result-item {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.result-source {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.result-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.view-button, .download-button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.view-button {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.download-button {
  background-color: white;
  color: #374151;
}

.citations {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}
```

## Step 6: Environment Configuration

### Create Environment File
```bash
# .env
REACT_APP_AWS_REGION=ap-southeast-1
REACT_APP_S3_BUCKET=treasury-documents
REACT_APP_QBUSINESS_APP_ID=your-qbusiness-app-id
REACT_APP_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net
```

## Step 7: Deploy Application

### Build and Deploy
```bash
# Build the application
npm run build

# Deploy to Amplify
amplify push

# Publish to hosting
amplify publish
```

### Verify Deployment
1. Check Amplify console for deployment status
2. Test authentication flow
3. Verify search functionality
4. Test regional filtering
5. Confirm file download/preview works

## Step 8: Post-Deployment Configuration

### Configure Custom Domain (Optional)
```bash
amplify add hosting
# Select: Add a custom domain
```

### Set up Monitoring
1. Enable CloudWatch logs for Amplify
2. Set up CloudWatch alarms for errors
3. Configure AWS X-Ray for tracing

### Security Hardening
1. Review IAM policies
2. Enable AWS WAF for the application
3. Configure HTTPS redirects
4. Set up proper CORS policies

## Troubleshooting

### Common Issues
1. **Authentication not working**: Check Amplify auth configuration
2. **Search returning no results**: Verify Q Business setup and permissions
3. **Regional filtering not working**: Check user region detection logic
4. **File downloads failing**: Verify CloudFront configuration

### Debug Commands
```bash
# Check Amplify status
amplify status

# View logs
amplify console

# Test local development
npm start
```

## Maintenance

### Regular Tasks
- Monitor application performance
- Update dependencies monthly
- Review and rotate access keys
- Monitor AWS costs
- Update documentation

### Scaling Considerations
- Monitor user growth and adjust Q Business capacity
- Consider implementing caching for search results
- Add load balancing if traffic increases
- Implement proper error handling and retry logic

## Next Steps
After successful deployment:
1. Train regional administrators on the system
2. Upload initial document set for testing
3. Gather user feedback and iterate
4. Plan for additional features (mobile app, advanced analytics)
