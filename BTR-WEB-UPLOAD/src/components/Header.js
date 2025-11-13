import React, { useState } from 'react';
import { getUserDisplayName, getUserRegionName, isUserAdmin } from '../utils/userUtils';

const Header = ({ user, signOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const displayName = getUserDisplayName(user);
  const regionName = getUserRegionName(user);
  const isAdmin = isUserAdmin(user);

  return (
    <header className="gov-header">
      {/* Government Banner */}
      <div className="gov-banner">
        <div className="banner-content">
          <span className="banner-text">
            An official website of the Republic of the Philippines
          </span>
          <div className="banner-links">
            <a href="https://www.gov.ph" target="_blank" rel="noopener noreferrer">
              Official Government Portal
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="header-container">
          {/* Logo Section */}
          <div className="header-logo">
            <div className="ph-seal-large">🇵🇭</div>
            <div className="header-title">
              <h1>Republic of the Philippines</h1>
              <h2>Bureau of Treasury</h2>
              <p className="system-name">Document Management System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="header-nav">
            <div className="nav-links">
              <a href="/" className="nav-link active">
                <span className="nav-icon">🔍</span>
                Search Documents
              </a>
              {isAdmin && (
                <a href="https://console.aws.amazon.com/s3" target="_blank" rel="noopener noreferrer" className="nav-link">
                  <span className="nav-icon">📁</span>
                  Upload Documents
                </a>
              )}
              <a href="#help" className="nav-link">
                <span className="nav-icon">❓</span>
                Help
              </a>
            </div>

            {/* User Menu */}
            <div className="user-menu">
              <button 
                className="user-menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="user-avatar">
                  <span className="avatar-icon">👤</span>
                </div>
                <div className="user-info">
                  <span className="user-name">{displayName}</span>
                  <span className="user-region">{regionName}</span>
                  {isAdmin && <span className="user-role">Administrator</span>}
                </div>
                <span className="dropdown-arrow">▼</span>
              </button>

              {isMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-user-info">
                      <strong>{displayName}</strong>
                      <span>{regionName}</span>
                      {isAdmin && <span className="admin-badge">Administrator</span>}
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-links">
                    <a href="#profile" className="dropdown-link">
                      <span className="dropdown-icon">👤</span>
                      Profile Settings
                    </a>
                    <a href="#preferences" className="dropdown-link">
                      <span className="dropdown-icon">⚙️</span>
                      Preferences
                    </a>
                    <a href="#help" className="dropdown-link">
                      <span className="dropdown-icon">❓</span>
                      Help & Support
                    </a>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={signOut} className="sign-out-button">
                    <span className="dropdown-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-button">
            <span className="hamburger-icon">☰</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="breadcrumb-container">
          <nav className="breadcrumb">
            <a href="https://www.gov.ph">gov.ph</a>
            <span className="breadcrumb-separator">›</span>
            <a href="#treasury">Bureau of Treasury</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Document Management</span>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
