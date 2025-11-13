import React from 'react';
import { getCloudFrontUrl, getFileIcon, formatFileSize } from '../utils/fileUtils';

const SearchResults = ({ results, query, userRegion, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large">⟳</div>
        <p>Searching documents...</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="search-placeholder">
        <div className="placeholder-icon">📋</div>
        <h3>Search Treasury Documents</h3>
        <p>Enter keywords or ask questions to search through Region {userRegion} documents</p>
        <div className="example-searches">
          <h4>Example searches:</h4>
          <div className="example-tags">
            <span className="example-tag">"budget allocation 2024"</span>
            <span className="example-tag">"infrastructure projects"</span>
            <span className="example-tag">"financial reports"</span>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">🔍</div>
        <h3>No documents found</h3>
        <p>No documents in Region {userRegion} match your search for "{query}"</p>
        <div className="search-suggestions">
          <h4>Try:</h4>
          <ul>
            <li>Different keywords or phrases</li>
            <li>More general terms</li>
            <li>Checking if documents have been uploaded to your region</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h3>Search Results</h3>
        <div className="results-meta">
          <span className="results-count">{results.length} document{results.length !== 1 ? 's' : ''} found</span>
          <span className="results-query">for "{query}" in Region {userRegion}</span>
        </div>
      </div>
      
      <div className="results-list">
        {results.map((result, index) => (
          <ResultItem 
            key={index} 
            result={result} 
            userRegion={userRegion}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

const ResultItem = ({ result, userRegion, index }) => {
  const handleViewDocument = () => {
    const url = getCloudFrontUrl(result.source);
    window.open(url, '_blank');
  };

  const handleDownloadDocument = () => {
    const url = getCloudFrontUrl(result.source);
    const filename = result.source.split('/').pop();
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filename = result.source.split('/').pop();
  const fileIcon = getFileIcon(filename);

  return (
    <div className="result-item">
      <div className="result-header">
        <div className="result-title-section">
          <span className="file-icon">{fileIcon}</span>
          <h4 className="result-title">{result.title || filename}</h4>
        </div>
        <div className="result-badges">
          <span className="region-badge">Region {userRegion}</span>
          {result.relevanceScore && (
            <span className="relevance-badge">
              {Math.round(result.relevanceScore * 100)}% match
            </span>
          )}
        </div>
      </div>
      
      {result.excerpt && (
        <div className="result-excerpt">
          <p>{result.excerpt}</p>
        </div>
      )}
      
      <div className="result-metadata">
        <span className="filename">{filename}</span>
        {result.fileSize && (
          <span className="file-size">{formatFileSize(result.fileSize)}</span>
        )}
        {result.lastModified && (
          <span className="last-modified">
            Modified: {new Date(result.lastModified).toLocaleDateString()}
          </span>
        )}
      </div>
      
      <div className="result-actions">
        <button 
          onClick={handleViewDocument}
          className="action-button primary"
          title="View document in new tab"
        >
          👁️ View
        </button>
        <button 
          onClick={handleDownloadDocument}
          className="action-button secondary"
          title="Download document"
        >
          📥 Download
        </button>
      </div>
      
      {result.citations && result.citations.length > 0 && (
        <div className="citations">
          <strong>Sources:</strong>
          <div className="citation-list">
            {result.citations.map((citation, idx) => (
              <span key={idx} className="citation-item">
                {citation}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
