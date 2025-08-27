// src/components/RoadmapLearning.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, FaUser, FaClock, FaCheckCircle, FaCircle, 
  FaPlay, FaBookmark, FaTrophy, FaExternalLinkAlt, 
  FaChevronLeft, FaChevronRight, FaChevronUp, FaChevronDown, 
  FaGraduationCap, FaCode, FaVideo, FaBook, FaFileAlt,
  FaDesktop, FaMobile, FaChartLine, FaRobot, FaShieldAlt, 
  FaCloud, FaDatabase, FaGamepad, FaLightbulb, FaUsers,
  FaGithub, FaYoutube, FaLink, FaStar, FaHeart, FaShare,
  FaDownload, FaCertificate, FaQuestionCircle, FaFire,
  FaBrain, FaHandsHelping, FaProjectDiagram, FaTools
} from 'react-icons/fa';
import axios from 'axios';
import { useTheme } from '../App';
import '../componentsCss/RoadmapLearning.css';

function RoadmapLearning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStep, setSelectedStep] = useState(0);
  const [userProgress, setUserProgress] = useState({ completedSteps: [], progress: 0 });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedResources, setExpandedResources] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [stepNotes, setStepNotes] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);

  const domainIcons = {
    'web-development': FaDesktop,
    'mobile-development': FaMobile,
    'data-science': FaChartLine,
    'machine-learning': FaRobot,
    'cybersecurity': FaShieldAlt,
    'cloud-computing': FaCloud,
    'database': FaDatabase,
    'game-development': FaGamepad,
    'devops': FaCode
  };

  const domainColors = {
    'web-development': { primary: '#3B82F6', secondary: '#EBF4FF', accent: '#1E40AF' },
    'mobile-development': { primary: '#10B981', secondary: '#ECFDF5', accent: '#047857' },
    'data-science': { primary: '#EF4444', secondary: '#FEF2F2', accent: '#B91C1C' },
    'machine-learning': { primary: '#8B5CF6', secondary: '#F3F4F6', accent: '#5B21B6' },
    'cybersecurity': { primary: '#F59E0B', secondary: '#FFFBEB', accent: '#D97706' },
    'cloud-computing': { primary: '#06B6D4', secondary: '#F0F9FF', accent: '#0891B2' },
    'database': { primary: '#6B7280', secondary: '#F9FAFB', accent: '#374151' },
    'game-development': { primary: '#F97316', secondary: '#FFF7ED', accent: '#EA580C' },
    'devops': { primary: '#7C3AED', secondary: '#F5F3FF', accent: '#5B21B6' }
  };

  // Enhanced learning resources with videos, documentation, and practice materials
  const enhancedResources = {
    'web-development': {
      fundamentals: {
        videos: [
          { title: 'HTML Crash Course', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', duration: '1h 40m', level: 'Beginner' },
          { title: 'CSS Complete Guide', url: 'https://www.youtube.com/watch?v=yfoY53QXEnI', duration: '11h', level: 'Intermediate' },
          { title: 'JavaScript Fundamentals', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', duration: '3h 26m', level: 'Beginner' }
        ],
        documentation: [
          { title: 'MDN Web Docs - HTML', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
          { title: 'MDN Web Docs - CSS', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
          { title: 'MDN Web Docs - JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' }
        ],
        practice: [
          { title: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/' },
          { title: 'Codepen', url: 'https://codepen.io/' },
          { title: 'JS Fiddle', url: 'https://jsfiddle.net/' }
        ]
      },
      frameworks: {
        videos: [
          { title: 'React JS Full Course', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', duration: '11h 48m', level: 'Intermediate' },
          { title: 'Vue.js Complete Guide', url: 'https://www.youtube.com/watch?v=FXpIoQ_rT_c', duration: '3h 40m', level: 'Intermediate' },
          { title: 'Angular Complete Tutorial', url: 'https://www.youtube.com/watch?v=k5E2AVpwsko', duration: '2h 47m', level: 'Advanced' }
        ],
        documentation: [
          { title: 'React Documentation', url: 'https://react.dev/' },
          { title: 'Vue.js Documentation', url: 'https://vuejs.org/' },
          { title: 'Angular Documentation', url: 'https://angular.io/' }
        ]
      }
    },
    'data-science': {
      fundamentals: {
        videos: [
          { title: 'Python for Data Science', url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', duration: '12h', level: 'Beginner' },
          { title: 'Statistics for Data Science', url: 'https://www.youtube.com/watch?v=xxpc-HPKN28', duration: '8h', level: 'Intermediate' },
          { title: 'Data Analysis with Pandas', url: 'https://www.youtube.com/watch?v=vmEHCJofslg', duration: '1h 20m', level: 'Intermediate' }
        ],
        documentation: [
          { title: 'Pandas Documentation', url: 'https://pandas.pydata.org/' },
          { title: 'NumPy Documentation', url: 'https://numpy.org/' },
          { title: 'Matplotlib Documentation', url: 'https://matplotlib.org/' }
        ]
      }
    },
    'machine-learning': {
      fundamentals: {
        videos: [
          { title: 'Machine Learning Course - Andrew Ng', url: 'https://www.youtube.com/watch?v=PPLop4L2eGk', duration: '11h', level: 'Intermediate' },
          { title: 'Deep Learning Specialization', url: 'https://www.youtube.com/watch?v=CS4cs9xVecg', duration: '15h', level: 'Advanced' },
          { title: 'TensorFlow Tutorial', url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk', duration: '7h', level: 'Intermediate' }
        ],
        documentation: [
          { title: 'TensorFlow Documentation', url: 'https://www.tensorflow.org/' },
          { title: 'PyTorch Documentation', url: 'https://pytorch.org/' },
          { title: 'Scikit-learn Documentation', url: 'https://scikit-learn.org/' }
        ]
      }
    }
  };

  useEffect(() => {
    fetchRoadmap();
    checkAuthStatus();
  }, [id]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/auth/contributions/${id}`);
      setRoadmap(response.data);
      
      // Initialize step notes
      const notes = {};
      response.data.roadmapSteps?.forEach((step, index) => {
        notes[index] = localStorage.getItem(`step-notes-${id}-${index}`) || '';
      });
      setStepNotes(notes);
      
      fetchUserProgress();
    } catch (err) {
      setError('Failed to fetch roadmap');
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:3001/api/user/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const roadmapProgress = response.data.completedRoadmaps?.find(r => r.roadmapId === id);
        if (roadmapProgress) {
          setUserProgress(roadmapProgress);
        }

        // Check if bookmarked
        const profileResponse = await axios.get('http://localhost:3001/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsBookmarked(profileResponse.data.bookmarkedRoadmaps?.includes(id));
      }
    } catch (err) {
      console.error('Error fetching user progress:', err);
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  const toggleStepCompletion = async (stepIndex) => {
    if (!isAuthenticated) {
      alert('Please login to track your progress');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const isCompleted = userProgress.completedSteps.includes(stepIndex);
      
      let newCompletedSteps;
      if (isCompleted) {
        newCompletedSteps = userProgress.completedSteps.filter(s => s !== stepIndex);
      } else {
        newCompletedSteps = [...userProgress.completedSteps, stepIndex];
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      const newProgress = Math.round((newCompletedSteps.length / roadmap.roadmapSteps.length) * 100);

      await axios.post(`http://localhost:3001/api/user/progress/${id}`, {
        completedSteps: newCompletedSteps,
        progress: newProgress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserProgress({
        completedSteps: newCompletedSteps,
        progress: newProgress
      });
    } catch (err) {
      console.error('Error updating progress:', err);
      alert('Failed to update progress. Please try again.');
    }
  };

  const saveStepNotes = (stepIndex, notes) => {
    setStepNotes(prev => ({ ...prev, [stepIndex]: notes }));
    localStorage.setItem(`step-notes-${id}-${stepIndex}`, notes);
  };

  const getResourceIcon = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return FaYoutube;
    if (url.includes('github.com')) return FaGithub;
    if (url.includes('.pdf')) return FaFileAlt;
    return FaLink;
  };

  const getDomainColor = () => {
    return domainColors[roadmap?.domain] || domainColors['web-development'];
  };

  const DomainIcon = domainIcons[roadmap?.domain] || FaDesktop;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your learning path...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchRoadmap}>Try Again</button>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="error-container">
        <p>Roadmap not found</p>
        <Link to="/explore" className="back-link">Back to Explore</Link>
      </div>
    );
  }

  const currentStep = roadmap.roadmapSteps[selectedStep];
  const isCurrentStepCompleted = userProgress.completedSteps.includes(selectedStep);
  const domainColor = getDomainColor();

  return (
    <div className={`roadmap-learning ${darkMode ? 'dark' : ''}`}>
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="celebration-content"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
            >
              <FaTrophy className="celebration-icon" />
              <h3>Step Completed! 🎉</h3>
              <p>Great job! Keep up the momentum!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="learning-header" style={{ borderBottomColor: domainColor.primary }}>
        <div className="header-content">
          <div className="header-left">
            <button onClick={() => navigate(-1)} className="back-button">
              <FaArrowLeft />
            </button>
            <div className="roadmap-info">
              <div className="domain-badge" style={{ backgroundColor: domainColor.secondary, color: domainColor.accent }}>
                <DomainIcon />
                <span>{roadmap.domain.replace('-', ' ').toUpperCase()}</span>
              </div>
              <h1 className="roadmap-title">{roadmap.title}</h1>
              <div className="roadmap-meta">
                <span><FaUser /> {roadmap.contributorName}</span>
                <span><FaClock /> {roadmap.estimatedTimeToComplete}</span>
                <span className="difficulty-badge" style={{ backgroundColor: domainColor.primary, color: 'white' }}>
                  {roadmap.difficultyLevel}
                </span>
              </div>
            </div>
          </div>
          <div className="header-right">
            {/* <div className="progress-circle" style={{ color: domainColor.primary }}>
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray={`${userProgress.progress}, 100`}
                  style={{ stroke: domainColor.primary }}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">{userProgress.progress}%</text>
              </svg>
            </div> */}
            <button 
              className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => {/* Add bookmark functionality */}}
            >
              <FaBookmark />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="learning-content">
        {/* Sidebar */}
        <div className="learning-sidebar">
          <div className="steps-overview">
            <h3>Learning Steps</h3>
            <div className="steps-list">
              {roadmap.roadmapSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`step-item ${selectedStep === index ? 'active' : ''} ${userProgress.completedSteps.includes(index) ? 'completed' : ''}`}
                  onClick={() => setSelectedStep(index)}
                  whileHover={{ x: 5 }}
                  style={{
                    borderLeftColor: selectedStep === index ? domainColor.primary : 'transparent'
                  }}
                >
                  <div className="step-marker">
                    {userProgress.completedSteps.includes(index) ? (
                      <FaCheckCircle style={{ color: domainColor.primary }} />
                    ) : (
                      <FaCircle className="step-number" />
                    )}
                    <span className="step-index">{index + 1}</span>
                  </div>
                  <div className="step-info">
                    <h4>{step.stepTitle}</h4>
                    <p>{step.stepDescription?.substring(0, 80)}...</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Learning Area */}
        <div className="learning-main">
          <div className="step-header">
            <div className="step-title-section">
              <h2>Step {selectedStep + 1}: {currentStep.stepTitle}</h2>
              <button
                className={`complete-step-btn ${isCurrentStepCompleted ? 'completed' : ''}`}
                onClick={() => toggleStepCompletion(selectedStep)}
                style={{ backgroundColor: isCurrentStepCompleted ? domainColor.primary : 'transparent' }}
              >
                {isCurrentStepCompleted ? <FaCheckCircle /> : <FaCircle />}
                {isCurrentStepCompleted ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
            
            <div className="step-navigation">
              <button
                className="nav-btn"
                disabled={selectedStep === 0}
                onClick={() => setSelectedStep(selectedStep - 1)}
              >
                <FaChevronLeft /> Previous
              </button>
              <button
                className="nav-btn"
                disabled={selectedStep === roadmap.roadmapSteps.length - 1}
                onClick={() => setSelectedStep(selectedStep + 1)}
              >
                Next <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              style={{ borderBottomColor: activeTab === 'overview' ? domainColor.primary : 'transparent' }}
            >
              <FaLightbulb /> Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
              style={{ borderBottomColor: activeTab === 'resources' ? domainColor.primary : 'transparent' }}
            >
              <FaBook /> Resources
            </button>
            <button
              className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
              onClick={() => setActiveTab('practice')}
              style={{ borderBottomColor: activeTab === 'practice' ? domainColor.primary : 'transparent' }}
            >
              <FaCode /> Practice
            </button>
            <button
              className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
              style={{ borderBottomColor: activeTab === 'notes' ? domainColor.primary : 'transparent' }}
            >
              <FaFileAlt /> Notes
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="overview-tab"
                >
                  <div className="step-description">
                    <h3>What you'll learn</h3>
                    <p>{currentStep.stepDescription}</p>
                  </div>

                  <div className="learning-objectives">
                    <h3>Learning Objectives</h3>
                    <ul>
                      <li>Understand the core concepts of {currentStep.stepTitle}</li>
                      <li>Apply practical knowledge through hands-on exercises</li>
                      <li>Build projects to reinforce learning</li>
                      <li>Prepare for the next step in your journey</li>
                    </ul>
                  </div>

                  <div className="estimated-time">
                    <h3>Estimated Time</h3>
                    <div className="time-breakdown">
                      <div className="time-item">
                        <FaVideo />
                        <span>Videos: 2-3 hours</span>
                      </div>
                      <div className="time-item">
                        <FaBook />
                        <span>Reading: 1-2 hours</span>
                      </div>
                      <div className="time-item">
                        <FaCode />
                        <span>Practice: 3-4 hours</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="resources-tab"
                >
                  {/* Video Resources */}
                  <div className="resource-section">
                    <h3><FaVideo /> Video Tutorials</h3>
                    <div className="resource-grid">
                      {enhancedResources[roadmap.domain]?.fundamentals?.videos?.map((video, index) => (
                        <div key={index} className="resource-card video-card">
                          <div className="resource-header">
                            <FaYoutube className="resource-icon youtube" />
                            <div className="resource-info">
                              <h4>{video.title}</h4>
                              <div className="video-meta">
                                <span className="duration">{video.duration}</span>
                                <span className={`level ${video.level.toLowerCase()}`}>{video.level}</span>
                              </div>
                            </div>
                          </div>
                          <a href={video.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                            <FaExternalLinkAlt /> Watch Video
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documentation */}
                  <div className="resource-section">
                    <h3><FaBook /> Documentation & Reading</h3>
                    <div className="resource-grid">
                      {enhancedResources[roadmap.domain]?.fundamentals?.documentation?.map((doc, index) => (
                        <div key={index} className="resource-card doc-card">
                          <div className="resource-header">
                            <FaFileAlt className="resource-icon doc" />
                            <div className="resource-info">
                              <h4>{doc.title}</h4>
                              <p>Official documentation and guides</p>
                            </div>
                          </div>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                            <FaExternalLinkAlt /> Read Documentation
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Original Resources */}
                  {currentStep.resources && currentStep.resources.length > 0 && (
                    <div className="resource-section">
                      <h3><FaLink /> Additional Resources</h3>
                      <div className="resource-list">
                        {currentStep.resources.map((resource, index) => {
                          const IconComponent = getResourceIcon(resource);
                          return (
                            <div key={index} className="resource-item">
                              <IconComponent className="resource-icon" />
                              <a href={resource} target="_blank" rel="noopener noreferrer">
                                {resource}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'practice' && (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="practice-tab"
                >
                  <div className="practice-section">
                    <h3><FaCode /> Hands-on Practice</h3>
                    <div className="practice-grid">
                      {enhancedResources[roadmap.domain]?.fundamentals?.practice?.map((practice, index) => (
                        <div key={index} className="practice-card">
                          <div className="practice-header">
                            <FaTools className="practice-icon" />
                            <h4>{practice.title}</h4>
                          </div>
                          <p>Interactive coding exercises and challenges</p>
                          <a href={practice.url} target="_blank" rel="noopener noreferrer" className="practice-link">
                            <FaExternalLinkAlt /> Start Practicing
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="project-ideas">
                    <h3><FaProjectDiagram /> Project Ideas</h3>
                    <div className="project-list">
                      <div className="project-item">
                        <h4>Beginner Project</h4>
                        <p>Build a simple application using the concepts from this step</p>
                      </div>
                      <div className="project-item">
                        <h4>Intermediate Project</h4>
                        <p>Create a more complex project that integrates multiple technologies</p>
                      </div>
                      <div className="project-item">
                        <h4>Advanced Project</h4>
                        <p>Develop a full-featured application with best practices</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notes' && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="notes-tab"
                >
                  <div className="notes-section">
                    <h3><FaFileAlt /> Your Notes</h3>
                    <textarea
                      className="notes-textarea"
                      placeholder="Take notes about this step..."
                      value={stepNotes[selectedStep] || ''}
                      onChange={(e) => saveStepNotes(selectedStep, e.target.value)}
                    />
                    <div className="notes-tips">
                      <h4>💡 Note-taking Tips:</h4>
                      <ul>
                        <li>Write down key concepts and definitions</li>
                        <li>Note any questions or confusing points</li>
                        <li>Record practical examples and code snippets</li>
                        <li>Track your progress and achievements</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadmapLearning;
