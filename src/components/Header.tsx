// Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="ancient-header">
      {/* Top Ornamental Bar */}
      <div className="header-ornament-top">
        <div className="container">
          <span>Digital Village Infrastructure Platform</span>
        </div>
      </div>
      
      {/* Main Header Section */}
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            {/* Government Emblem */}
            <div className="site-emblem">
              <img src="/emblem.png" alt="Government Emblem" />
            </div>
            
            {/* Site Title */}
            <div className="site-title-wrapper">
              <h1 className="site-title">सुदर्शन</h1>
              <p className="site-subtitle">Sudarshan - Village Digital Twin</p>
            </div>
            
            {/* Right Logo */}
            <div className="site-emblem">
              <img src="/logo.png" alt="Village Logo" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <nav className="ancient-nav">
        <div className="container">
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="/" className="nav-link active">Home</a>
            </li>
            <li className="nav-item">
              <a href="/infrastructure" className="nav-link">Infrastructure</a>
            </li>
            <li className="nav-item">
              <a href="/dashboard" className="nav-link">Dashboard</a>
            </li>
            <li className="nav-item">
              <a href="/analytics" className="nav-link">Analytics</a>
            </li>
            <li className="nav-item">
              <a href="/reports" className="nav-link">Reports</a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link">About</a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link">Contact</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
