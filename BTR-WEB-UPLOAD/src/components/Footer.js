import React from 'react';

const Footer = () => {
  return (
    <footer className="gov-footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Agency Information */}
            <div className="footer-section">
              <h3>Bureau of Treasury</h3>
              <p>The Bureau of Treasury is the government's central treasury responsible for government funds and securities management.</p>
              <div className="footer-contact">
                <p><strong>Address:</strong> BSP Complex, Roxas Boulevard, Manila</p>
                <p><strong>Phone:</strong> (02) 8708-7000</p>
                <p><strong>Email:</strong> info@treasury.gov.ph</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#about">About BTr</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#transparency">Transparency</a></li>
                <li><a href="#reports">Reports & Publications</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>

            {/* Government Links */}
            <div className="footer-section">
              <h3>Government</h3>
              <ul className="footer-links">
                <li><a href="https://www.gov.ph" target="_blank" rel="noopener noreferrer">Official Government Portal</a></li>
                <li><a href="https://www.dof.gov.ph" target="_blank" rel="noopener noreferrer">Department of Finance</a></li>
                <li><a href="https://www.bsp.gov.ph" target="_blank" rel="noopener noreferrer">Bangko Sentral ng Pilipinas</a></li>
                <li><a href="https://www.bir.gov.ph" target="_blank" rel="noopener noreferrer">Bureau of Internal Revenue</a></li>
                <li><a href="https://www.boc.gov.ph" target="_blank" rel="noopener noreferrer">Bureau of Customs</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-section">
              <h3>Resources</h3>
              <ul className="footer-links">
                <li><a href="#faq">Frequently Asked Questions</a></li>
                <li><a href="#user-guide">User Guide</a></li>
                <li><a href="#system-status">System Status</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Use</a></li>
                <li><a href="#accessibility">Accessibility</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="footer-left">
              <p>&copy; 2024 Bureau of Treasury, Republic of the Philippines. All rights reserved.</p>
              <p>This is an official government website.</p>
            </div>
            <div className="footer-right">
              <div className="footer-badges">
                <div className="gov-badge">
                  <span className="badge-icon">🇵🇭</span>
                  <span className="badge-text">Official Government Website</span>
                </div>
                <div className="security-badge">
                  <span className="badge-icon">🔒</span>
                  <span className="badge-text">Secure Connection</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legal Notice */}
          <div className="legal-notice">
            <p>
              <strong>Notice:</strong> This system is for authorized users only. 
              All activities are monitored and logged. Unauthorized access is prohibited 
              and may result in criminal prosecution under Republic Act 10175 (Cybercrime Prevention Act of 2012).
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
