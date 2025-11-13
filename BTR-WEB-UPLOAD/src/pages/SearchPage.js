import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import { searchDocuments } from '../utils/qbusinessClient';
import { getUserRegion } from '../utils/userUtils';

const SearchPage = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize user region to prevent unnecessary re-renders
  const userRegion = useMemo(() => getUserRegion(user), [user]);

  // Memoized search handler to prevent unnecessary re-renders
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearchQuery(query);
    setError(null);
    
    try {
      const results = await searchDocuments(query);
      
      // Filter results by user's region
      const filteredResults = results.filter(result => 
        result.source.includes(`/region-${userRegion}/`)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search documents. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [userRegion]);

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="page-header">
          <h2>Document Search</h2>
          {userRegion && (
            <div className="region-info">
              <span className="region-badge">Region {userRegion}</span>
            </div>
          )}
        </div>
        
        <SearchBox onSearch={handleSearch} loading={loading} />
        
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        
        <SearchResults 
          results={searchResults} 
          query={searchQuery}
          userRegion={userRegion}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SearchPage;
