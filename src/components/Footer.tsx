// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="ancient-footer">
      <div className="container">
        {/* Decorative Ornament */}
        <div className="footer-ornament">
          ❖ ❖ ❖
        </div>
        
        {/* Footer Content Grid */}
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h4>About Sudarshan</h4>
            <p>
              A comprehensive digital twin platform for village infrastructure 
              monitoring, management, and development planning.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/infrastructure">Infrastructure</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/analytics">Analytics</a></li>
              <li><a href="/reports">Reports</a></li>
              <li><a href="/docs">Documentation</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/faq">FAQs</a></li>
              <li><a href="/guidelines">Guidelines</a></li>
              <li><a href="/api">API Documentation</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul>
              <li>📧 Email: info@sudarshan.gov.in</li>
              <li>📞 Phone: +91-XXXX-XXXXXX</li>
              <li>📍 Address: Village Panchayat Office</li>
              <li>🕐 Hours: Mon-Fri, 9 AM - 5 PM</li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2025 Sudarshan Digital Twin Platform. All Rights Reserved.</p>
          <p>
            <a href="/privacy">Privacy Policy</a> | 
            <a href="/terms">Terms of Service</a> | 
            <a href="/accessibility">Accessibility</a>
          </p>
          <p>Powered by Government of India Initiative</p>
        </div>
      </div>
      
      {/* Disclaimer Bar */}
      <div className="footer-disclaimer">
        <div className="container">
          <p>
            This is an official Government of India website. 
            Content is updated and maintained by the respective department.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
