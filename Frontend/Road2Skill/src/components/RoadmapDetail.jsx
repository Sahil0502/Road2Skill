import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, FaUser, FaClock, FaTag, FaCheckCircle, FaCircle, 
  FaPlay, FaBookmark, FaTrophy, FaShare, FaExternalLinkAlt, 
  FaChevronLeft, FaChevronRight, FaGraduationCap, FaCode,
  FaDesktop, FaMobile, FaChartLine, FaRobot, FaShieldAlt, 
  FaCloud, FaDatabase, FaGamepad, FaBookOpen, FaLightbulb,
  FaHeart, FaRegHeart, FaStar, FaAward, FaUsers, FaFire,
  FaDownload, FaPrint, FaEye, FaCertificate
} from 'react-icons/fa';
import axios from 'axios';
import { useTheme } from '../App';
import '../componentsCss/RoadmapDetail.css';

function RoadmapDetail() {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStep, setSelectedStep] = useState(0);
  const [userProgress, setUserProgress] = useState({ completedSteps: [], progress: 0 });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    'devops': { primary: '#14B8A6', secondary: '#F0FDFA', accent: '#0F766E' }
  };

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:3001/api/auth/contributions/${id}`);
      setRoadmap(response.data);
    } catch (err) {
      setError('Failed to fetch roadmap. Please try again.');
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRoadmap();
      checkAuthentication();
      if (localStorage.getItem('token')) {
        fetchUserProgress();
        fetchBookmarkStatus();
      }
    }
  }, [id]);

  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  const fetchUserProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:3001/api/user/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const roadmapProgress = response.data.completedRoadmaps?.find(
        rm => rm.roadmapId === id
      );
      
      if (roadmapProgress) {
        setUserProgress({
          completedSteps: roadmapProgress.completedSteps || [],
          progress: roadmapProgress.progress || 0
        });
      }
    } catch (err) {
      console.error('Error fetching user progress:', err);
    }
  };

  const fetchBookmarkStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:3001/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsBookmarked(response.data.bookmarkedRoadmaps?.includes(id) || false);
    } catch (err) {
      console.error('Error fetching bookmark status:', err);
    }
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
        newCompletedSteps = userProgress.completedSteps.filter(step => step !== stepIndex);
      } else {
        newCompletedSteps = [...userProgress.completedSteps, stepIndex];
      }

      const newProgress = Math.round((newCompletedSteps.length / roadmap.roadmapSteps.length) * 100);

      await axios.post(`http://localhost:3001/api/user/progress/${id}`, {
        stepIndex,
        completed: !isCompleted
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserProgress({
        completedSteps: newCompletedSteps,
        progress: newProgress
      });

      // Show celebration when completing a step
      if (!isCompleted) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      alert('Failed to update progress. Please try again.');
    }
  };

  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark roadmaps');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = isBookmarked ? 'DELETE' : 'POST';
      
      await axios({
        method,
        url: `http://localhost:3001/api/user/bookmark/${id}`,
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      alert('Failed to update bookmark. Please try again.');
    }
  };

  const getDifficultyInfo = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return { color: '#10B981', icon: '🟢', label: 'Beginner Friendly' };
      case 'Intermediate': return { color: '#F59E0B', icon: '🟡', label: 'Intermediate Level' };
      case 'Advanced': return { color: '#EF4444', icon: '🔴', label: 'Advanced Level' };
      default: return { color: '#6B7280', icon: '⚪', label: 'Unknown Level' };
    }
  };

  const nextStep = () => {
    if (selectedStep < roadmap.roadmapSteps.length - 1) {
      setSelectedStep(selectedStep + 1);
    }
  };

  const prevStep = () => {
    if (selectedStep > 0) {
      setSelectedStep(selectedStep - 1);
    }
  };

  const getEstimatedReadTime = (description) => {
    const wordsPerMinute = 200;
    const words = description.split(' ').length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  if (loading) {
    return (
      <div className={`roadmap-detail ${darkMode ? 'dark' : ''}`}>
        <div className="loading-container">
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h3>Loading your learning journey...</h3>
          <p>Preparing an amazing learning experience for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`roadmap-detail ${darkMode ? 'dark' : ''}`}>
        <div className="error-container">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="error-content"
          >
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={fetchRoadmap} className="retry-btn">
                <FaPlay /> Try Again
              </button>
              <Link to="/roadmaps" className="back-btn">
                <FaArrowLeft /> Back to Roadmaps
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className={`roadmap-detail ${darkMode ? 'dark' : ''}`}>
        <div className="not-found-container">
          <h3>Roadmap not found</h3>
          <p>The learning path you're looking for doesn't exist or has been removed.</p>
          <Link to="/roadmaps" className="back-btn">
            <FaArrowLeft /> Explore Other Roadmaps
          </Link>
        </div>
      </div>
    );
  }

  const DomainIcon = domainIcons[roadmap.domain] || FaCode;
  const domainTheme = domainColors[roadmap.domain] || domainColors['web-development'];
  const currentStep = roadmap.roadmapSteps[selectedStep];
  const difficultyInfo = getDifficultyInfo(roadmap.difficultyLevel);

  return (
    <div className={`roadmap-detail ${darkMode ? 'dark' : ''}`} style={{'--theme-primary': domainTheme.primary, '--theme-secondary': domainTheme.secondary, '--theme-accent': domainTheme.accent}}>
      
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
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: -50 }}
            >
              <FaTrophy className="celebration-icon" />
              <h3>Step Completed! 🎉</h3>
              <p>Great job! Keep up the momentum!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-content">
          <nav className="breadcrumb">
            <Link to="/roadmaps" className="breadcrumb-link">
              <FaArrowLeft /> Roadmaps
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {roadmap.domain?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </nav>

          <div className="hero-main">
            <div className="hero-left">
              <div className="domain-badge">
                <DomainIcon className="domain-icon" />
                <span>{roadmap.domain?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
              
              <h1 className="hero-title">{roadmap.title}</h1>
              <p className="hero-description">{roadmap.roadmapDescription}</p>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <FaGraduationCap className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{roadmap.roadmapSteps.length}</span>
                    <span className="stat-label">Learning Steps</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <FaClock className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{roadmap.estimatedTimeToComplete || 'Self-paced'}</span>
                    <span className="stat-label">Duration</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="difficulty-indicator" style={{backgroundColor: difficultyInfo.color}}>
                    <span>{difficultyInfo.icon}</span>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{roadmap.difficultyLevel}</span>
                    <span className="stat-label">Difficulty</span>
                  </div>
                </div>

                <div className="stat-item">
                  <FaUser className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{roadmap.contributorName || 'Anonymous'}</span>
                    <span className="stat-label">Instructor</span>
                  </div>
                </div>
              </div>

              <div className="hero-actions">
                <button
                  className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                  onClick={toggleBookmark}
                >
                  {isBookmarked ? <FaHeart /> : <FaRegHeart />}
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
                
                <button className="share-btn">
                  <FaShare /> Share
                </button>
              </div>
            </div>

            <div className="hero-right">
              {/* Progress Circle */}
              {isAuthenticated && (
                <div className="progress-circle-container">
                  <div className="progress-circle">
                    <svg className="progress-ring" width="120" height="120">
                      <circle
                        className="progress-ring-background"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        r="52"
                        cx="60"
                        cy="60"
                      />
                      <circle
                        className="progress-ring-progress"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        r="52"
                        cx="60"
                        cy="60"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 52}`,
                          strokeDashoffset: `${2 * Math.PI * 52 * (1 - userProgress.progress / 100)}`
                        }}
                      />
                    </svg>
                    <div className="progress-text">
                      <span className="progress-percentage">{userProgress.progress}%</span>
                      <span className="progress-label">Complete</span>
                    </div>
                  </div>
                  <p className="progress-stats">
                    {userProgress.completedSteps.length} of {roadmap.roadmapSteps.length} steps completed
                  </p>
                </div>
              )}

              {/* Tech Stack */}
              <div className="tech-stack-card">
                <h4><FaCode /> Tech Stack</h4>
                <div className="tech-tags">
                  {roadmap.techStack.split(',').map((tech, index) => (
                    <span key={index} className="tech-tag">{tech.trim()}</span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {roadmap.tags && roadmap.tags.length > 0 && (
                <div className="tags-card">
                  <h4><FaTag /> Topics</h4>
                  <div className="topic-tags">
                    {roadmap.tags.map((tag, index) => (
                      <span key={index} className="topic-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-container">
          
          {/* Steps Sidebar */}
          <div className="steps-sidebar">
            <div className="sidebar-header">
              <h3><FaGraduationCap /> Learning Path</h3>
              <span className="steps-count">{roadmap.roadmapSteps.length} Steps</span>
            </div>
            
            <div className="steps-list">
              {roadmap.roadmapSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`step-item ${selectedStep === index ? 'active' : ''} ${
                    userProgress.completedSteps.includes(index) ? 'completed' : ''
                  }`}
                  onClick={() => setSelectedStep(index)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="step-marker">
                    {userProgress.completedSteps.includes(index) ? (
                      <FaCheckCircle className="completed-icon" />
                    ) : (
                      <span className="step-number">{index + 1}</span>
                    )}
                  </div>
                  <div className="step-content">
                    <h4 className="step-title">{step.stepTitle}</h4>
                    <p className="step-preview">{step.stepDescription?.substring(0, 60)}...</p>
                    <div className="step-meta">
                      <span className="read-time">
                        <FaEye /> {getEstimatedReadTime(step.stepDescription)} min read
                      </span>
                      {step.resources && step.resources.length > 0 && (
                        <span className="resources-count">
                          <FaExternalLinkAlt /> {step.resources.length} resources
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="step-content-area">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="step-detail-card"
              >
                <div className="step-header">
                  <div className="step-badge">
                    Step {selectedStep + 1} of {roadmap.roadmapSteps.length}
                  </div>
                  <div className="step-actions">
                    <button
                      className={`complete-btn ${
                        userProgress.completedSteps.includes(selectedStep) ? 'completed' : ''
                      }`}
                      onClick={() => toggleStepCompletion(selectedStep)}
                      disabled={!isAuthenticated}
                    >
                      {userProgress.completedSteps.includes(selectedStep) ? (
                        <>
                          <FaCheckCircle /> Completed
                        </>
                      ) : (
                        <>
                          <FaCircle /> Mark as Complete
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <h2 className="step-title">{currentStep.stepTitle}</h2>
                <div className="step-description">
                  <p>{currentStep.stepDescription}</p>
                </div>

                {/* Resources Section */}
                {currentStep.resources && currentStep.resources.length > 0 && (
                  <div className="resources-section">
                    <h3 className="resources-title">
                      <FaBookOpen /> Learning Resources
                    </h3>
                    <div className="resources-grid">
                      {currentStep.resources.map((resource, index) => (
                        <motion.a
                          key={index}
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-card"
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="resource-icon">
                            <FaExternalLinkAlt />
                          </div>
                          <div className="resource-content">
                            <h4>Resource {index + 1}</h4>
                            <p>{new URL(resource).hostname}</p>
                            <span className="resource-url">{resource}</span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="step-navigation">
                  <button
                    onClick={prevStep}
                    disabled={selectedStep === 0}
                    className="nav-btn prev-btn"
                  >
                    <FaChevronLeft /> Previous
                  </button>
                  
                  <div className="nav-indicator">
                    <div className="nav-dots">
                      {roadmap.roadmapSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`nav-dot ${index === selectedStep ? 'active' : ''} ${
                            userProgress.completedSteps.includes(index) ? 'completed' : ''
                          }`}
                          onClick={() => setSelectedStep(index)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={nextStep}
                    disabled={selectedStep === roadmap.roadmapSteps.length - 1}
                    className="nav-btn next-btn"
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      {userProgress.progress === 100 && (
        <motion.div
          className="achievement-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="achievement-content">
            <FaCertificate className="achievement-icon" />
            <h3>Congratulations! 🎉</h3>
            <p>You've completed the entire roadmap! You're now ready to take on real-world projects.</p>
            <button className="certificate-btn">
              <FaDownload /> Download Certificate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default RoadmapDetail;
