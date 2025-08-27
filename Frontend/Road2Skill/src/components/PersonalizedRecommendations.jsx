import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaBookmark, FaExternalLinkAlt, FaRobot, FaYoutube, FaStickyNote, FaChevronRight, FaTrophy, FaFire, FaClock, FaUser, FaCog, FaEdit, FaTimes, FaCheckCircle, FaLightbulb, FaRocket, FaGraduationCap, FaCode, FaStar } from 'react-icons/fa';
import axios from 'axios';
import '../componentsCss/PersonalizedRecommendations.css';

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState({
    roadmaps: [],
    videos: [],
    resources: [],
    notes: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roadmaps');
  const [userProfile, setUserProfile] = useState(null);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsData, setSettingsData] = useState({});
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [showInteractiveView, setShowInteractiveView] = useState(false);

  useEffect(() => {
    // Load mock data immediately for testing
    setRecommendations({
      roadmaps: [
        {
          id: '1',
          title: 'Full Stack Web Development',
          description: 'Complete MERN stack development path',
          difficulty: 'Intermediate',
          estimatedTime: '6 months',
          matchScore: 95,
          reasons: ['Matches your web development interest', 'Aligns with your intermediate level']
        },
        {
          id: '2',
          title: 'React Advanced Patterns',
          description: 'Master advanced React concepts and patterns',
          difficulty: 'Advanced',
          estimatedTime: '2 months',
          matchScore: 88,
          reasons: ['Builds on your React knowledge', 'Perfect for skill advancement']
        }
      ],
      videos: [
        {
          id: 'dQw4w9WgXcQ',
          title: 'React Hooks Complete Guide',
          channel: 'Tech Academy',
          duration: '45:32',
          views: '1.2M',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          relevance: 'High'
        },
        {
          id: 'abc123def456',
          title: 'Node.js Best Practices 2024',
          channel: 'Dev Insights',
          duration: '32:18',
          views: '850K',
          thumbnail: 'https://img.youtube.com/vi/abc123def456/maxresdefault.jpg',
          relevance: 'Medium'
        }
      ],
      resources: [
        {
          id: '1',
          title: 'JavaScript ES6+ Features Guide',
          type: 'Article',
          source: 'MDN Web Docs',
          readTime: '15 min',
          difficulty: 'Intermediate',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'
        },
        {
          id: '2',
          title: 'React Documentation',
          type: 'Documentation',
          source: 'React.dev',
          readTime: '2-3 hours',
          difficulty: 'All Levels',
          url: 'https://react.dev'
        }
      ],
      notes: [
        {
          id: '1',
          title: 'React Hooks Cheat Sheet',
          content: 'Quick reference for useState, useEffect, and custom hooks...',
          topic: 'React',
          createdAt: '2024-01-15',
          aiGenerated: true
        }
      ]
    });
    
    // Add mock user profile data for testing
    setUserProfile({
      domains: ['Web Development', 'React', 'JavaScript'],
      experience: 'Intermediate',
      learningGoals: ['Full Stack Development', 'Advanced React Patterns'],
      interests: ['Frontend Development', 'UI/UX Design']
    });
    
    setLoading(false);
    
    fetchRecommendations();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      setUserProfile(response.data);
      setSettingsData(response.data); // Initialize settings with current profile
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      console.log('Fetching recommendations...');
      const response = await axios.get('/api/recommendations', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Recommendations response:', response.data);
      
      if (response.data && response.data.roadmaps) {
        setRecommendations(response.data);
        console.log('Set recommendations:', response.data);
      } else {
        console.log('No recommendations found, generating new ones...');
        // Generate initial recommendations if none exist
        await generateRecommendations();
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      console.log('Loading fallback mock data...');
      // Load mock data for development
      setRecommendations({
        roadmaps: [
          {
            id: '1',
            title: 'Full Stack Web Development',
            description: 'Complete MERN stack development path',
            difficulty: 'Intermediate',
            estimatedTime: '6 months',
            matchScore: 95,
            reasons: ['Matches your web development interest', 'Aligns with your intermediate level']
          },
          {
            id: '2',
            title: 'React Advanced Patterns',
            description: 'Master advanced React concepts and patterns',
            difficulty: 'Advanced',
            estimatedTime: '2 months',
            matchScore: 88,
            reasons: ['Builds on your React knowledge', 'Perfect for skill advancement']
          }
        ],
        videos: [
          {
            id: 'dQw4w9WgXcQ',
            title: 'React Hooks Complete Guide',
            channel: 'Tech Academy',
            duration: '45:32',
            views: '1.2M',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            relevance: 'High'
          },
          {
            id: 'abc123def456',
            title: 'Node.js Best Practices 2024',
            channel: 'Dev Insights',
            duration: '32:18',
            views: '850K',
            thumbnail: 'https://img.youtube.com/vi/abc123def456/maxresdefault.jpg',
            relevance: 'Medium'
          }
        ],
        resources: [
          {
            id: '1',
            title: 'JavaScript ES6+ Features Guide',
            type: 'Article',
            source: 'MDN Web Docs',
            readTime: '15 min',
            difficulty: 'Intermediate',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'
          },
          {
            id: '2',
            title: 'React Documentation',
            type: 'Documentation',
            source: 'React.dev',
            readTime: '2-3 hours',
            difficulty: 'All Levels',
            url: 'https://react.dev'
          }
        ],
        notes: [
          {
            id: '1',
            title: 'React Hooks Cheat Sheet',
            content: 'Quick reference for useState, useEffect, and custom hooks...',
            topic: 'React',
            createdAt: '2024-01-15',
            aiGenerated: true
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setGeneratingContent(true);
    try {
      console.log('Generating recommendations...');
      const response = await axios.post('/api/recommendations/generate', {}, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Generate response:', response.data);
      await fetchRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      console.log('Error details:', error.response?.data);
    } finally {
      setGeneratingContent(false);
    }
  };

  const generateNotes = async (topic) => {
    setGeneratingContent(true);
    try {
      const response = await axios.post('/api/ai/generate-notes', 
        { topic, userProfile }, 
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      setRecommendations(prev => ({
        ...prev,
        notes: [...prev.notes, response.data]
      }));
    } catch (error) {
      console.error('Error generating notes:', error);
    } finally {
      setGeneratingContent(false);
    }
  };

  const bookmarkItem = async (type, itemId) => {
    try {
      await axios.post('/api/user/bookmark', 
        { type, itemId }, 
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error bookmarking item:', error);
    }
  };

  const updateSettings = async () => {
    try {
      setGeneratingContent(true);
      await axios.put('/api/user/onboarding', settingsData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      setUserProfile(settingsData);
      setShowSettings(false);
      
      // Regenerate recommendations with new preferences
      await generateRecommendations();
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleSettingsChange = (field, value) => {
    setSettingsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelectSettings = (field, value) => {
    setSettingsData(prev => ({
      ...prev,
      [field]: prev[field]?.includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...(prev[field] || []), value]
    }));
  };

  const openInteractiveRoadmap = (roadmap) => {
    setSelectedRoadmap(roadmap);
    setShowInteractiveView(true);
  };

  const closeInteractiveView = () => {
    setShowInteractiveView(false);
    setSelectedRoadmap(null);
  };

  const RoadmapCard = ({ roadmap }) => {
    // Create a shorter overview from the description
    const overview = roadmap.description.length > 100 
      ? roadmap.description.substring(0, 100) + "..." 
      : roadmap.description;

    return (
      <motion.div
        className="recommendation-card roadmap-card"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card-header">
          <div className="match-score">
            <span className="score">{roadmap.matchScore}%</span>
            <span className="label">Match</span>
          </div>
          <button 
            className="bookmark-btn"
            onClick={() => bookmarkItem('roadmap', roadmap.id)}
          >
            <FaBookmark />
          </button>
        </div>
        
        <div className="card-content">
          <h3>{roadmap.title}</h3>
          <p className="roadmap-overview">{overview}</p>
          
          <div className="roadmap-meta">
            <span className="difficulty">{roadmap.difficulty}</span>
            <span className="time">
              <FaClock /> {roadmap.estimatedTime}
            </span>
          </div>
          
          <div className="quick-highlights">
            <div className="highlight-item">
              <FaTrophy className="highlight-icon" />
              <span>{roadmap.matchScore}% Match</span>
            </div>
            <div className="highlight-item">
              <FaUser className="highlight-icon" />
              <span>{roadmap.difficulty} Level</span>
            </div>
          </div>
        </div>
        
        <div className="card-actions">
          <button 
            className="btn btn-primary start-learning-btn"
            onClick={() => openInteractiveRoadmap(roadmap)}
          >
            <FaPlay /> Start Learning
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => generateNotes(roadmap.title)}
          >
            <FaStickyNote /> Quick Notes
          </button>
        </div>
      </motion.div>
    );
  };

  const VideoCard = ({ video }) => (
    <motion.div
      className="recommendation-card video-card"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="video-thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <div className="video-duration">{video.duration}</div>
        <div className="play-overlay">
          <FaPlay />
        </div>
      </div>
      
      <div className="card-content">
        <h3>{video.title}</h3>
        <div className="video-meta">
          <span className="channel">
            <FaUser /> {video.channel}
          </span>
          <span className="views">{video.views} views</span>
          <span className={`relevance ${video.relevance.toLowerCase()}`}>
            {video.relevance} Relevance
          </span>
        </div>
      </div>
      
      <div className="card-actions">
        <a 
          href={`https://youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <FaYoutube /> Watch on YouTube
        </a>
        <button 
          className="btn btn-outline"
          onClick={() => bookmarkItem('video', video.id)}
        >
          <FaBookmark /> Save
        </button>
      </div>
    </motion.div>
  );

  const ResourceCard = ({ resource }) => (
    <motion.div
      className="recommendation-card resource-card"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="card-content">
        <h3>{resource.title}</h3>
        <div className="resource-meta">
          <span className="type">{resource.type}</span>
          <span className="source">{resource.source}</span>
          <span className="read-time">
            <FaClock /> {resource.readTime}
          </span>
          <span className="difficulty">{resource.difficulty}</span>
        </div>
      </div>
      
      <div className="card-actions">
        <a 
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <FaExternalLinkAlt /> Read Article
        </a>
        <button 
          className="btn btn-outline"
          onClick={() => bookmarkItem('resource', resource.id)}
        >
          <FaBookmark /> Save
        </button>
      </div>
    </motion.div>
  );

  const NoteCard = ({ note }) => (
    <motion.div
      className="recommendation-card note-card"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="card-header">
        {note.aiGenerated && (
          <div className="ai-badge">
            <FaRobot /> AI Generated
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h3>{note.title}</h3>
        <p className="note-preview">{note.content}</p>
        <div className="note-meta">
          <span className="topic">{note.topic}</span>
          <span className="date">{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="card-actions">
        <button className="btn btn-primary">
          <FaStickyNote /> View Full Note
        </button>
      </div>
    </motion.div>
  );

  const SettingsModal = () => {
    const domainOptions = [
      'web-development', 'mobile-development', 'data-science', 'machine-learning', 
      'cybersecurity', 'cloud-computing', 'database', 'game-development', 'devops'
    ];

    const experienceOptions = ['beginner', 'some-knowledge', 'intermediate', 'advanced', 'expert'];
    const goalOptions = ['career-change', 'skill-upgrade', 'certification', 'freelancing', 'startup', 'promotion'];
    const timeOptions = ['1-3', '4-7', '8-15', '16+'];
    const styleOptions = ['visual', 'hands-on', 'reading', 'mixed'];

    return (
      <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
        <motion.div 
          className="settings-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="modal-header">
            <h2><FaCog /> Update Learning Preferences</h2>
            <button className="close-btn" onClick={() => setShowSettings(false)}>×</button>
          </div>
          
          <div className="modal-content">
            <div className="settings-section">
              <h3>Experience Level</h3>
              <div className="settings-options">
                {experienceOptions.map(option => (
                  <button
                    key={option}
                    className={`option-btn ${settingsData.experience === option ? 'selected' : ''}`}
                    onClick={() => handleSettingsChange('experience', option)}
                  >
                    {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h3>Interested Domains</h3>
              <div className="settings-options multi-select">
                {domainOptions.map(domain => (
                  <button
                    key={domain}
                    className={`option-btn ${settingsData.domains?.includes(domain) ? 'selected' : ''}`}
                    onClick={() => handleMultiSelectSettings('domains', domain)}
                  >
                    {domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h3>Learning Goals</h3>
              <div className="settings-options multi-select">
                {goalOptions.map(goal => (
                  <button
                    key={goal}
                    className={`option-btn ${settingsData.goals?.includes(goal) ? 'selected' : ''}`}
                    onClick={() => handleMultiSelectSettings('goals', goal)}
                  >
                    {goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h3>Time Commitment (hours/week)</h3>
              <div className="settings-options">
                {timeOptions.map(time => (
                  <button
                    key={time}
                    className={`option-btn ${settingsData.timeCommitment === time ? 'selected' : ''}`}
                    onClick={() => handleSettingsChange('timeCommitment', time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h3>Learning Style</h3>
              <div className="settings-options">
                {styleOptions.map(style => (
                  <button
                    key={style}
                    className={`option-btn ${settingsData.preferredLearningStyle === style ? 'selected' : ''}`}
                    onClick={() => handleSettingsChange('preferredLearningStyle', style)}
                  >
                    {style.replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h3>Current Study Focus</h3>
              <textarea
                value={settingsData.currentStudy || ''}
                onChange={(e) => handleSettingsChange('currentStudy', e.target.value)}
                placeholder="What are you currently studying or working on?"
                rows={3}
                className="settings-textarea"
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              className="btn btn-outline" 
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={updateSettings}
              disabled={generatingContent}
            >
              {generatingContent ? 'Updating...' : 'Save & Regenerate'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const InteractiveRoadmapView = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const [showCelebration, setShowCelebration] = useState(false);

    if (!selectedRoadmap) return null;

    // Generate detailed steps based on the roadmap
    const generateDetailedSteps = (roadmap) => {
      const baseSteps = [
        {
          title: "🎯 Getting Started",
          description: "Set up your learning environment and understand the basics",
          duration: "1-2 weeks",
          tasks: ["Install required tools", "Set up development environment", "Complete introductory tutorial"],
          resources: ["Official documentation", "Setup guide video", "Community forum"],
          difficulty: "Beginner"
        },
        {
          title: "🏗️ Foundation Building",
          description: "Master the fundamental concepts and core principles",
          duration: "2-4 weeks", 
          tasks: ["Learn core concepts", "Practice basic exercises", "Build first mini-project"],
          resources: ["Interactive tutorials", "Practice exercises", "Code examples"],
          difficulty: "Beginner"
        },
        {
          title: "🚀 Intermediate Skills",
          description: "Dive deeper into advanced topics and real-world applications",
          duration: "4-6 weeks",
          tasks: ["Advanced concepts", "Complex projects", "Best practices"],
          resources: ["Advanced tutorials", "Project templates", "Expert interviews"],
          difficulty: "Intermediate"
        },
        {
          title: "🎓 Mastery & Portfolio",
          description: "Create impressive projects and prepare for real-world scenarios",
          duration: "3-4 weeks",
          tasks: ["Capstone project", "Portfolio development", "Interview preparation"],
          resources: ["Project ideas", "Portfolio examples", "Interview guides"],
          difficulty: "Advanced"
        }
      ];
      return baseSteps;
    };

    const steps = generateDetailedSteps(selectedRoadmap);

    const handleStepComplete = (stepIndex) => {
      const newCompleted = new Set(completedSteps);
      if (completedSteps.has(stepIndex)) {
        newCompleted.delete(stepIndex);
      } else {
        newCompleted.add(stepIndex);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      setCompletedSteps(newCompleted);
    };

    const progressPercentage = (completedSteps.size / steps.length) * 100;

    return (
      <AnimatePresence>
        <div className="interactive-roadmap-overlay">
          <motion.div 
            className="interactive-roadmap-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Header */}
            <div className="roadmap-header">
              <div className="header-content">
                <div className="roadmap-title-section">
                  <h1>{selectedRoadmap.title}</h1>
                  <p className="roadmap-subtitle">{selectedRoadmap.description}</p>
                  <div className="roadmap-stats">
                    <span className="stat-item">
                      <FaClock /> {selectedRoadmap.estimatedTime}
                    </span>
                    <span className="stat-item">
                      <FaTrophy /> {selectedRoadmap.difficulty}
                    </span>
                    <span className="stat-item">
                      <FaStar /> {selectedRoadmap.matchScore}% Match
                    </span>
                  </div>
                </div>
                <button className="close-interactive-btn" onClick={closeInteractiveView}>
                  <FaTimes />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-info">
                  <span>Your Progress</span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
                <div className="progress-bar-container">
                  <motion.div 
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Steps Content */}
            <div className="roadmap-content">
              <div className="steps-navigation">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    className={`step-nav-btn ${currentStep === index ? 'active' : ''} ${completedSteps.has(index) ? 'completed' : ''}`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="step-nav-icon">
                      {completedSteps.has(index) ? <FaCheckCircle /> : <span>{index + 1}</span>}
                    </div>
                    <span className="step-nav-title">{step.title}</span>
                  </button>
                ))}
              </div>

              <div className="step-details">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="step-content"
                >
                  <div className="step-header">
                    <h2>{steps[currentStep].title}</h2>
                    <span className={`difficulty-badge ${steps[currentStep].difficulty.toLowerCase()}`}>
                      {steps[currentStep].difficulty}
                    </span>
                  </div>
                  
                  <p className="step-description">{steps[currentStep].description}</p>
                  
                  <div className="step-duration">
                    <FaClock /> Estimated Time: {steps[currentStep].duration}
                  </div>

                  <div className="step-section">
                    <h3><FaRocket /> Tasks to Complete</h3>
                    <ul className="task-list">
                      {steps[currentStep].tasks.map((task, index) => (
                        <li key={index} className="task-item">
                          <FaCode className="task-icon" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="step-section">
                    <h3><FaLightbulb /> Learning Resources</h3>
                    <div className="resources-grid">
                      {steps[currentStep].resources.map((resource, index) => (
                        <div key={index} className="resource-item">
                          <FaBookmark className="resource-icon" />
                          <span>{resource}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="step-actions">
                    <button
                      className={`complete-step-btn ${completedSteps.has(currentStep) ? 'completed' : ''}`}
                      onClick={() => handleStepComplete(currentStep)}
                    >
                      {completedSteps.has(currentStep) ? (
                        <>
                          <FaCheckCircle /> Completed!
                        </>
                      ) : (
                        <>
                          <FaCheckCircle /> Mark as Complete
                        </>
                      )}
                    </button>
                    
                    {currentStep < steps.length - 1 && (
                      <button
                        className="next-step-btn"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Next Step <FaChevronRight />
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

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
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <FaTrophy className="celebration-icon" />
                    <h3>Great Job! 🎉</h3>
                    <p>Step completed successfully!</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="personalized-recommendations">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personalized-recommendations">
      <div className="recommendations-header">
        <div className="header-main">
          <div className="header-content">
            <div className="title-section">
              <h1>
                <FaRobot className="header-icon" />
                Your Personalized Learning Path
              </h1>
              <p className="header-description">
                AI-curated content based on your interests and learning goals
              </p>
              
              {userProfile && (
                <div className="user-context">
                  <div className="context-item">
                    <FaUser className="context-icon" />
                    <span>Tailored for: {userProfile.domains?.join(', ')}</span>
                  </div>
                  <div className="context-item">
                    <FaGraduationCap className="context-icon" />
                    <span>Level: {userProfile.experience}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn btn-outline settings-btn"
              onClick={() => setShowSettings(true)}
              title="Update Learning Preferences"
            >
              <FaCog />
              <span className="btn-text">Settings</span>
            </button>
            <button 
              className="btn btn-primary refresh-btn"
              onClick={generateRecommendations}
              disabled={generatingContent}
            >
              <FaFire />
              <span className="btn-text">
                {generatingContent ? 'Generating...' : 'Refresh Recommendations'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="recommendations-tabs">
        {[
          { key: 'roadmaps', label: 'Learning Paths', icon: FaTrophy },
          { key: 'videos', label: 'Videos', icon: FaYoutube },
          { key: 'resources', label: 'Resources', icon: FaExternalLinkAlt },
          { key: 'notes', label: 'AI Notes', icon: FaStickyNote }
        ].map(tab => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon />
            {tab.label}
            <span className="count">
              {recommendations[tab.key]?.length || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="recommendations-content">
        <div className="recommendations-grid">
          {activeTab === 'roadmaps' && recommendations.roadmaps.map(roadmap => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}
          
          {activeTab === 'videos' && recommendations.videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
          
          {activeTab === 'resources' && recommendations.resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
          
          {activeTab === 'notes' && recommendations.notes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>

        {recommendations[activeTab]?.length === 0 && (
          <div className="empty-state">
            <FaRobot className="empty-icon" />
            <h3>No {activeTab} recommendations yet</h3>
            <p>Complete your profile setup to get personalized recommendations</p>
            <button 
              className="btn btn-primary"
              onClick={generateRecommendations}
            >
              Generate Recommendations
            </button>
          </div>
        )}
      </div>

      {showSettings && <SettingsModal />}
      
      {/* Interactive Roadmap Modal */}
      {showInteractiveView && <InteractiveRoadmapView />}
    </div>
  );
};

export default PersonalizedRecommendations;
