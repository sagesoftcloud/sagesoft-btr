import React, { useState } from 'react';

const SearchBox = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="search-box">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search treasury documents... (e.g., 'budget allocation', 'financial report', 'Republic Act')"
            className="search-input"
            disabled={loading}
          />
          {query && (
            <button 
              type="button"
              onClick={handleClear}
              className="clear-button"
              disabled={loading}
            >
              ✕
            </button>
          )}
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <span className="loading-spinner">⟳</span>
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

export default SearchBox;
