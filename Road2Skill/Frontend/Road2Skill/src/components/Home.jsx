// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../componentsCss/Home.css';

function Home({ isLoggedIn }) {
  return (
    <div className="home-container">
      <div className="front-page">
        <div className="front-page-description">
          <h1>Welcome to Road2Skill</h1>
          <p>Discover and contribute to roadmaps on our platform.</p>
        </div>
      </div>

      <div className="what-we-do">
        <h2>What We Do</h2>
        <div className="features">
          <Link to="/roadmaps" className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Roadmaps</h3>
            <p>Explore comprehensive roadmaps to guide your learning journey.</p>
          </Link>
          <div className="feature-card coming-soon">
            <div className="feature-icon">🤖</div>
            <h3>AI Chat</h3>
            <p>Coming soon: Interactive AI chat to assist with your queries.</p>
          </div>
          <div className="feature-card coming-soon">
            <div className="feature-icon">📝</div>
            <h3>Assessment</h3>
            <p>Coming soon: Assessment tools to evaluate your skills.</p>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Road2Skill. All rights reserved.</p>
        <p>Contact us: info@road2skill.com</p>
        <div className="social-media">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> |
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
