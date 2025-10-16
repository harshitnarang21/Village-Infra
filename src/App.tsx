import React from 'react';

const App: React.FC = () => {
  return (
    <>
      {/* COMPACT HEADER */}
      <header className="ancient-header">
        <div className="header-main">
          <div className="container">
            <div className="header-content">
              <div className="site-emblem">🏛️</div>
              
              <div className="site-title-wrapper">
                <h1 className="site-title">सुदर्शन</h1>
                <p className="site-subtitle">Sudarshan - Village Digital Twin</p>
              </div>
              
              <div className="site-emblem">🌾</div>
            </div>
          </div>
        </div>
        
        <nav className="ancient-nav">
          <div className="container">
            <ul className="nav-menu">
              <li><a href="#home" className="nav-link active">Home</a></li>
              <li><a href="#usps" className="nav-link">Why Sudarshan</a></li>
              <li><a href="#infrastructure" className="nav-link">Infrastructure</a></li>
              <li><a href="#dashboard" className="nav-link">Dashboard</a></li>
              <li><a href="#analytics" className="nav-link">Analytics</a></li>
              <li><a href="#about" className="nav-link">About</a></li>
              <li><a href="#contact" className="nav-link">Contact</a></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="container">
            <h1>Welcome to Sudarshan</h1>
            <p>Empowering Rural India Through Intelligent Infrastructure Management</p>
            <a href="#usps" className="btn">Explore Features</a>
          </div>
        </section>

        {/* USP SECTION - FUNCTIONAL */}
        <section className="section" id="usps">
          <div className="container">
            <h2>Why Choose Sudarshan?</h2>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
              India's first AI-powered village infrastructure digital twin platform
            </p>
            
            <div className="grid grid-3">
              <div className="card">
                <div className="card-header">
                  <div className="card-ornament">🤖</div>
                  <h3 className="card-title">AI Predictive Maintenance</h3>
                </div>
                <p>
                  <strong>Machine learning predicts infrastructure failures 2-4 weeks in advance.</strong> 
                  Reduces maintenance costs by 30% and extends asset life by 20-40%. 
                  Real-time IoT sensor integration for continuous monitoring and proactive maintenance scheduling.
                </p>
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(0, 230, 118, 0.1)', borderLeft: '3px solid #00e676' }}>
                  <strong>ROI:</strong> 30% cost reduction in first year
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-ornament">⛓️</div>
                  <h3 className="card-title">Blockchain Transparency</h3>
                </div>
                <p>
                  <strong>Immutable audit trail for all budgets and work orders.</strong> 
                  Smart contracts for automatic vendor payments based on milestone completion. 
                  Public ledger accessible to all citizens ensuring complete transparency in governance.
                </p>
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(0, 176, 255, 0.1)', borderLeft: '3px solid #00b0ff' }}>
                  <strong>Impact:</strong> Zero corruption, 100% accountability
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-ornament">🗳️</div>
                  <h3 className="card-title">Citizen Participation</h3>
                </div>
                <p>
                  <strong>Direct community voting on infrastructure priorities.</strong> 
                  Issue reporting with photo/video evidence and real-time tracking. 
                  Gamified engagement system with rewards for active participation and community building.
                </p>
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(255, 152, 0, 0.1)', borderLeft: '3px solid #ff9800' }}>
                  <strong>Engagement:</strong> 10x increase in citizen participation
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-ornament">📡</div>
                  <h3 className="card-title">Offline-First Design</h3>
                </div>
                <p>
                  <strong>Functions seamlessly without internet connectivity.</strong> 
                  Auto-sync when connection is restored with conflict resolution. 
                  SMS alerts for critical updates ensuring communication even in remote areas.
                </p>
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(156, 39, 176, 0.1)', borderLeft: '3px solid #9c27b0' }}>
                  <strong>Coverage:</strong> 100% rural accessibility
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-ornament">🗣️</div>
                  <h3 className="card-title">Voice & Multi-Language</h3>
                </div>
                <p>
                  <strong>Support for 22+ Indian languages including regional dialects.</strong> 
                  WhatsApp bot integration for familiar user experience. 
                  Voice interface for complete accessibility across all literacy levels.
                </p>
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(255, 193, 7, 0.1)', borderLeft: '3px solid #ffc107' }}>
                  <strong>Inclusion:</strong> Accessible to 95% of rural population
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-ornament">🌱</div>
                  <h3 className="card-title">Sustainability Dashboard</h3>
                </div>
                <p>
                  <strong>Real-time carbon footprint tracking for all activities.</strong> 
                  Energy consumption monitoring with efficiency recommendations. 
                  ESG compliance reporting for sustainable development goals and environmental impact.
                </p>
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(76, 175, 80, 0.1)', borderLeft: '3px solid #4caf50' }}>
                  <strong>Green:</strong> 40% reduction in carbon emissions
                </div>
              </div>
            </div>

            {/* Competitive Advantages */}
            <div style={{ marginTop: '4rem' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Competitive Advantages</h3>
              <div className="grid grid-2">
                <div className="card card-highlight">
                  <p style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                    ✅ <strong>Only platform</strong> with AI predictive maintenance for rural India
                  </p>
                </div>
                <div className="card card-highlight">
                  <p style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                    ✅ <strong>First</strong> blockchain-verified infrastructure transparency system
                  </p>
                </div>
                <div className="card card-highlight">
                  <p style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                    ✅ <strong>Most accessible</strong> (offline, voice, 22+ languages)
                  </p>
                </div>
                <div className="card card-highlight">
                  <p style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                    ✅ <strong>Government-ready</strong> (complies with Digital India guidelines)
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <a href="#contact" className="btn" style={{ marginRight: '1rem' }}>Request Demo</a>
              <a href="#dashboard" className="btn">View Dashboard</a>
            </div>
          </div>
        </section>

        {/* DASHBOARD WIDGETS SECTION */}
        <section className="section" id="dashboard">
          <div className="container">
            <h2>Infrastructure Overview</h2>
            
            <div className="grid grid-3">
              <div className="widget">
                <div className="widget-icon">💧</div>
                <div className="widget-header">
                  <h3 className="widget-title">Water Supply</h3>
                </div>
                <div className="widget-value">89%</div>
                <p className="widget-label">System Efficiency</p>
              </div>

              <div className="widget">
                <div className="widget-icon">⚡</div>
                <div className="widget-header">
                  <h3 className="widget-title">Electricity</h3>
                </div>
                <div className="widget-value">95%</div>
                <p className="widget-label">Grid Coverage</p>
              </div>

              <div className="widget">
                <div className="widget-icon">🛣️</div>
                <div className="widget-header">
                  <h3 className="widget-title">Roads</h3>
                </div>
                <div className="widget-value">78%</div>
                <p className="widget-label">Road Condition</p>
              </div>

              <div className="widget">
                <div className="widget-icon">🏥</div>
                <div className="widget-header">
                  <h3 className="widget-title">Healthcare</h3>
                </div>
                <div className="widget-value">92%</div>
                <p className="widget-label">Facility Access</p>
              </div>

              <div className="widget">
                <div className="widget-icon">🏫</div>
                <div className="widget-header">
                  <h3 className="widget-title">Education</h3>
                </div>
                <div className="widget-value">88%</div>
                <p className="widget-label">School Enrollment</p>
              </div>

              <div className="widget">
                <div className="widget-icon">🌾</div>
                <div className="widget-header">
                  <h3 className="widget-title">Agriculture</h3>
                </div>
                <div className="widget-value">85%</div>
                <p className="widget-label">Crop Yield Index</p>
              </div>
            </div>
          </div>
        </section>

        {/* INFRASTRUCTURE FEATURES SECTION */}
        <section className="section" id="infrastructure">
          <div className="container">
            <h2>Key Features</h2>
            
            <div className="grid grid-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Real-time Monitoring</h3>
                  <div className="card-ornament">❖</div>
                </div>
                <p>Monitor all village infrastructure in real-time with IoT sensors and smart devices for immediate insights and proactive maintenance.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Data Analytics</h3>
                  <div className="card-ornament">❖</div>
                </div>
                <p>Advanced analytics and reporting tools to make informed decisions for infrastructure development and resource optimization.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Resource Planning</h3>
                  <div className="card-ornament">❖</div>
                </div>
                <p>Optimize resource allocation and plan sustainable development initiatives with predictive models and scenario analysis.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Digital Twin Technology</h3>
                  <div className="card-ornament">❖</div>
                </div>
                <p>Create virtual replicas of physical infrastructure to simulate, predict, and optimize performance before implementation.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Community Engagement</h3>
                  <div className="card-ornament">❖</div>
                </div>
                <p>Enable citizen participation through feedback mechanisms, grievance redressal, and transparent communication channels.</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Smart Governance</h3>
                  <div className="card-ornament">❖</div>
                </div>
                <p>Implement evidence-based policy making with comprehensive dashboards, alerts, and automated reporting systems.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ANALYTICS SECTION */}
        <section className="section" id="analytics">
          <div className="container">
            <h2>Analytics & Reports</h2>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Comprehensive Data Insights</h3>
                <div className="card-ornament">❖</div>
              </div>
              <p>
                Our analytics platform provides deep insights into village infrastructure performance, 
                resource utilization patterns, and development trends. Generate custom reports, visualize 
                data through interactive charts, and export findings for stakeholder presentations.
              </p>
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <a href="#contact" className="btn">Request Demo</a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="section" id="about">
          <div className="container">
            <h2>About Sudarshan Platform</h2>
            <p>
              Sudarshan (सुदर्शन) is India's first AI-powered digital twin platform designed specifically 
              for village infrastructure monitoring and management. Built on modern technology principles 
              while respecting traditional values, our platform enables local governments and communities 
              to track, analyze, and improve essential services.
            </p>
            <p>
              By combining IoT sensors, machine learning, blockchain transparency, and user-friendly interfaces, 
              Sudarshan empowers decision-makers with real-time insights and predictive capabilities for 
              sustainable rural development.
            </p>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a href="#contact" className="btn">Get Started</a>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="section" id="contact">
          <div className="container">
            <h2>Contact Us</h2>
            <div className="grid grid-3">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Email</h3>
                  <div className="card-ornament">✉️</div>
                </div>
                <p>info@sudarshan.gov.in</p>
                <p>support@sudarshan.gov.in</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Phone</h3>
                  <div className="card-ornament">📞</div>
                </div>
                <p>Toll-Free: 1800-XXX-XXXX</p>
                <p>Office: +91-XXXX-XXXXXX</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Location</h3>
                  <div className="card-ornament">📍</div>
                </div>
                <p>Village Panchayat Office</p>
                <p>Mon-Fri: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="ancient-footer">
        <div className="container">
          <div className="footer-ornament">❖ ❖ ❖</div>
          
          <div className="footer-content">
            <div className="footer-section">
              <h4>About Sudarshan</h4>
              <p>India's first AI-powered digital twin platform for village infrastructure monitoring, management, and sustainable development planning.</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#usps">Why Sudarshan</a></li>
                <li><a href="#infrastructure">Infrastructure</a></li>
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#analytics">Analytics</a></li>
                <li><a href="#about">About Us</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#faq">FAQs</a></li>
                <li><a href="#guidelines">Guidelines</a></li>
                <li><a href="#api">API Documentation</a></li>
                <li><a href="#support">Support</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Contact Us</h4>
              <ul>
                <li>📧 info@sudarshan.gov.in</li>
                <li>📞 +91-XXXX-XXXXXX</li>
                <li>📍 Village Panchayat Office</li>
                <li>🕐 Mon-Fri, 9 AM - 5 PM</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2025 Sudarshan Digital Twin Platform. All Rights Reserved.</p>
            <p>
              <a href="#privacy">Privacy Policy</a> | 
              <a href="#terms">Terms of Service</a> | 
              <a href="#accessibility">Accessibility</a>
            </p>
            <p>Powered by Government of India Initiative</p>
          </div>
        </div>
        
        <div className="footer-disclaimer">
          <div className="container">
            <p>This is an official Government of India website. Content is updated and maintained by the respective department.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
