import React, { useState, useCallback } from 'react';

const SearchBox = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  return (
    <div className="search-box">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search treasury documents... (e.g., 'budget allocation', 'financial report', 'Republic Act')"
            className="search-input"
            disabled={loading}
            aria-label="Search treasury documents"
          />
          {query && (
            <button 
              type="button"
              onClick={handleClear}
              className="clear-button"
              disabled={loading}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !query.trim()}
            aria-label={loading ? 'Searching...' : 'Search documents'}
          >
            {loading ? (
              <span className="loading-spinner" aria-hidden="true">⟳</span>
            ) : (
              '🔍 Search'
            )}
          </button>
        </div>
      </form>
      
      <div className="search-tips">
        <strong>Search Tips:</strong>
        <ul>
          <li>Use specific terms like "budget", "financial report", or "Republic Act"</li>
          <li>Ask questions like "What are the infrastructure projects?"</li>
          <li>Search by document type, date, or department</li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(SearchBox);
