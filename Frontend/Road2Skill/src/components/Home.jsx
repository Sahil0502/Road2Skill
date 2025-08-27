// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaUsers, FaTrophy, FaStar, FaArrowRight, FaPlay, FaBookOpen, FaLightbulb, FaBriefcase } from 'react-icons/fa';
import { useTheme } from '../App';
import '../componentsCss/Home.css';

function Home({ isLoggedIn }) {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    totalRoadmaps: 150,
    activeUsers: 5200,
    completedProjects: 1800,
    successStories: 95
  });

  const features = [
    {
      icon: <FaRocket />,
      title: 'Interactive Roadmaps',
      description: 'Visual learning paths with step-by-step guidance and progress tracking.',
      link: '/interactive-roadmaps',
      color: 'var(--primary-color)',
      available: true
    },
    {
      icon: <FaBookOpen />,
      title: 'Resource Hub',
      description: 'Curated collection of videos, articles, courses, and tools for every skill.',
      link: '/resources',
      color: 'var(--accent-color)',
      available: true
    },
    {
      icon: <FaUsers />,
      title: 'Community Insights',
      description: 'Connect with learners, share experiences, and get help from the community.',
      link: '/community',
      color: 'var(--secondary-color)',
      available: true
    },
    {
      icon: <FaBriefcase />,
      title: 'Career Guidance',
      description: 'Expert advice on resumes, interviews, portfolios, and career transitions.',
      link: '/career',
      color: '#10b981',
      available: true
    },
    {
      icon: <FaTrophy />,
      title: 'Progress Tracking',
      description: 'Track your learning journey with XP, levels, badges, and achievements.',
      link: isLoggedIn ? '/my-progress' : '/login',
      color: '#f59e0b',
      available: true
    },
    {
      icon: <FaLightbulb />,
      title: 'AI Learning Assistant',
      description: 'Personalized AI mentor to guide your learning journey and provide recommendations.',
      link: isLoggedIn ? '/recommendations' : '/login',
      color: '#8b5cf6',
      available: true
    }
  ];

  const testimonials = [
    {
      name: 'Sahil Singh',
      role: 'Full Stack Developer',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
      quote: 'Road2Skill helped me transition from marketing to tech in just 8 months. The interactive roadmaps made learning so much easier!'
    },
    {
      name: 'Ehtesham Ansari',
      role: 'Data Scientist',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff',
      quote: 'The community support and structured learning paths gave me the confidence to land my dream job at a top tech company.'
    },
    {
      name: 'Rajiv Ranjan',
      role: 'UI/UX Designer',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=f59e0b&color=fff',
      quote: 'Amazing platform! The progress tracking and badges kept me motivated throughout my learning journey.'
    }
  ];

  return (
    <div className="modern-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Your Ultimate Guide to
              <span className="gradient-text"> Skill Mastery</span>
            </h1>
            <p className="hero-description">
              Navigate your path from beginner to pro with structured roadmaps, 
              curated resources, and a supportive community. Whether you're exploring 
              career options or upskilling, Road2Skill provides the guidance you need to succeed.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary hero-btn">
                <FaPlay /> Start Learning
              </Link>
              <Link to="/roadmaps" className="btn btn-outline hero-btn">
                Explore Roadmaps <FaArrowRight />
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="floating-cards">
              <div className="floating-card card-1">
                <FaRocket className="card-icon" />
                <span>Interactive Learning</span>
              </div>
              <div className="floating-card card-2">
                <FaTrophy className="card-icon" />
                <span>Track Progress</span>
              </div>
              <div className="floating-card card-3">
                <FaUsers className="card-icon" />
                <span>Join Community</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05 }}
          >
            <div className="stat-number">{stats.totalRoadmaps}+</div>
            <div className="stat-label">Learning Roadmaps</div>
          </motion.div>
          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05 }}
          >
            <div className="stat-number">{stats.activeUsers.toLocaleString()}+</div>
            <div className="stat-label">Active Learners</div>
          </motion.div>
          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05 }}
          >
            <div className="stat-number">{stats.completedProjects.toLocaleString()}+</div>
            <div className="stat-label">Projects Completed</div>
          </motion.div>
          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05 }}
          >
            <div className="stat-number">{stats.successStories}%</div>
            <div className="stat-label">Success Rate</div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything You Need to Succeed</h2>
          <p>Comprehensive tools and resources to accelerate your learning journey</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`feature-card modern-card ${!feature.available ? 'coming-soon' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={feature.available ? { y: -5 } : {}}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              {feature.available ? (
                <Link to={feature.link} className="feature-link">
                  Explore <FaArrowRight />
                </Link>
              ) : (
                <span className="coming-soon-badge">Coming Soon</span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>Success Stories</h2>
          <p>Hear from learners who transformed their careers with Road2Skill</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card modern-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p>{testimonial.quote}</p>
              </div>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of learners who are already building their dream careers</p>
          <div className="cta-actions">
            {!isLoggedIn ? (
              <>
                <Link to="/create-account" className="btn btn-primary cta-btn">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline cta-btn">
                  Sign In
                </Link>
              </>
            ) : (
              <>
                <Link to="/interactive-roadmaps" className="btn btn-primary cta-btn">
                  Continue Learning
                </Link>
                <Link to="/profile" className="btn btn-primary cta-btn">
                  View Progress
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Road2Skill</h3>
            <p>Your ultimate guide to skill mastery and career success.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://www.linkedin.com/in/sahil-singh-ss9824/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/roadmaps">Roadmaps</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/community">Community</Link></li>
              <li><Link to="/career">Career Guidance</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Road2Skill. All rights reserved.</p>
          <p>Made with ❤️ for learners worldwide</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
