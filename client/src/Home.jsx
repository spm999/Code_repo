import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div id="home-container">
      {/* Navigation */}

      {/* Hero Section */}
      <section id="hero-section">
        <div className="hero-content">
          <p className="hero-description">
            A secure platform to store, manage, and share automation scripts, 
            utilities, and code modules across departments.
          </p>

          <div className="cta-buttons">
            <Link to="/register" className="primary-btn">Get Started Free</Link>
          </div>

          {/* Stats */}
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Code Files</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section">
        <div className="features-content">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <p className="section-subtitle">
            Designed for developers, by developers. Experience the future of code management.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Storage</h3>
              <p className="feature-description">
                Enterprise-grade security with encrypted storage and role-based access control.
              </p>
            </div>
            
            {/* <div className="feature-card">
              <div className="feature-icon">🏷️</div>
              <h3 className="feature-title">Smart Tagging</h3>
              <p className="feature-description">
                AI-powered metadata extraction and intelligent tagging for easy discovery.
              </p>
            </div> */}
            
            {/* <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI Assistant</h3>
              <p className="feature-description">
                Built-in AI that explains code, suggests optimizations, and guides best practices.
              </p>
            </div>
             */}
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Version Control</h3>
              <p className="feature-description">
                Complete version history with diff viewing and rollback capabilities.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Collaboration</h3>
              <p className="feature-description">
                Real-time collaboration features with comments and code reviews.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Fast Search</h3>
              <p className="feature-description">
                Lightning-fast search across millions of lines of code with advanced filters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Code Management?</h2>
          <p className="cta-description">
            Join thousands of developers who trust our platform to streamline their workflow and boost productivity.
          </p>
          
          <div className="cta-buttons">
            <Link to="/register" className="primary-btn">Start Free Trial</Link>
            <Link to="/demo" className="secondary-btn">Request Demo</Link>
          </div>
          
          <div className="cta-note">
            <span>⭐</span>
            <span>No credit card required • Free 14-day trial</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="main-footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-info">
              <div className="footer-logo">
                <div className="logo-icon">
                  <span>CR</span>
                </div>
                <span className="logo-text">CodeRepository</span>
              </div>
              <p className="footer-description">
                The ultimate platform for code storage and management
              </p>
            </div>
            
            <div className="footer-links-group">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links">
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Demo</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
            
            <div className="footer-links-group">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-links-group">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">
              © {new Date().getFullYear()} CodeRepository. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/admin/login">Admin</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}