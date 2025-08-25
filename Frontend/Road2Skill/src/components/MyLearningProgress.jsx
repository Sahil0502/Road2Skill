import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCheck, FaLock, FaStar, FaClock, FaUsers, FaChevronRight, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import '../componentsCss/MyLearningProgress.css';

const MyLearningProgress = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmaps();
    fetchUserProgress();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      // First, try to get user progress
      let userRoadmapIds = [];
      
      try {
        const progressResponse = await axios.get('/api/user/progress', {
          withCredentials: true
        });
        userRoadmapIds = progressResponse.data.completedRoadmaps?.map(r => r.roadmapId) || [];
      } catch (error) {
        console.log('No user progress found yet or not authenticated');
      }
      
      // Get all roadmaps
      const response = await axios.get('/api/roadmaps');
      const allRoadmaps = response.data || [];
      
      // If user has no progress, show sample data with mock progress
      if (userRoadmapIds.length === 0 && allRoadmaps.length > 0) {
        // Show first 3 roadmaps with sample progress
        const sampleRoadmaps = allRoadmaps.slice(0, 3);
        setRoadmaps(sampleRoadmaps);
        
        // Add sample progress data
        const sampleProgress = {};
        sampleRoadmaps.forEach((roadmap, index) => {
          const completedSteps = index === 0 ? [0, 1, 2] : index === 1 ? [0, 1] : [0];
          const progress = Math.round((completedSteps.length / roadmap.roadmapSteps.length) * 100);
          sampleProgress[roadmap._id] = {
            completedSteps,
            progress
          };
        });
        setUserProgress(sampleProgress);
      } else if (userRoadmapIds.length > 0) {
        // Filter to only show roadmaps user has started
        const userRoadmaps = allRoadmaps.filter(roadmap => 
          userRoadmapIds.includes(roadmap._id)
        );
        setRoadmaps(userRoadmaps);
      } else {
        setRoadmaps([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      // Fallback: show empty state
      setRoadmaps([]);
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('/api/user/progress', {
        withCredentials: true
      });
      
      const progressMap = {};
      response.data.completedRoadmaps?.forEach(roadmap => {
        progressMap[roadmap.roadmapId] = {
          progress: roadmap.progress,
          completedSteps: roadmap.completedSteps
        };
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      // Don't set mock data here - it will be handled by fetchRoadmaps
    }
  };

  const handleStartRoadmap = async (roadmapId) => {
    try {
      await axios.post(`/api/user/progress/start/${roadmapId}`, {}, {
        withCredentials: true
      });

      // Refresh the roadmaps and progress data
      await fetchRoadmaps();
      await fetchUserProgress();
      
      alert('Roadmap started successfully! You can now track your progress.');
    } catch (error) {
      console.error('Error starting roadmap:', error);
      if (error.response?.status === 401) {
        alert('Please login to start learning');
      } else if (error.response?.status === 400) {
        alert('This roadmap is already in your learning path!');
      } else {
        alert('Failed to start roadmap. Please try again.');
      }
    }
  };

  const handleStepComplete = async (roadmapId, stepIndex) => {
    try {
      const isCompleted = userProgress[roadmapId]?.completedSteps?.includes(stepIndex);
      const roadmap = roadmaps.find(r => r._id === roadmapId);
      const totalSteps = roadmap?.roadmapSteps.length || 1;

      const response = await axios.post(`/api/user/progress/${roadmapId}`, {
        stepIndex,
        completed: !isCompleted,
        totalSteps
      }, {
        withCredentials: true
      });
      
      // Update local state with server response
      setUserProgress(prev => ({
        ...prev,
        [roadmapId]: {
          completedSteps: response.data.completedSteps,
          progress: response.data.progress
        }
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
      if (error.response?.status === 401) {
        alert('Please login to update progress');
      } else {
        alert('Failed to update progress. Please try again.');
      }
    }
  };

  const getStepStatus = (roadmapId, stepIndex) => {
    const progress = userProgress[roadmapId];
    if (!progress) return 'locked';
    
    if (progress.completedSteps?.includes(stepIndex)) return 'completed';
    if (stepIndex === 0 || progress.completedSteps?.includes(stepIndex - 1)) return 'available';
    return 'locked';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'var(--accent-color)';
      case 'Intermediate': return 'var(--secondary-color)';
      case 'Advanced': return '#ef4444';
      default: return 'var(--text-secondary)';
    }
  };

  const RoadmapFlowchart = ({ roadmap }) => {
    const progress = userProgress[roadmap._id] || { completedSteps: [], progress: 0 };
    
    return (
      <div className="roadmap-flowchart">
        <div className="flowchart-header">
          <h3>{roadmap.title}</h3>
          <div className="progress-info">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
            <span>{progress.progress}% Complete</span>
          </div>
        </div>
        
        <div className="flowchart-steps">
          {roadmap.roadmapSteps.map((step, index) => {
            const status = getStepStatus(roadmap._id, index);
            const isLastStep = index === roadmap.roadmapSteps.length - 1;
            
            return (
              <div key={index} className="step-flow-container">
                <motion.div
                  className={`step-node ${status}`}
                  whileHover={status === 'available' ? { scale: 1.05 } : {}}
                  whileTap={status === 'available' ? { scale: 0.95 } : {}}
                  onClick={() => status === 'available' && handleStepComplete(roadmap._id, index)}
                >
                  <div className="step-icon">
                    {status === 'completed' && <FaCheck />}
                    {status === 'available' && <FaPlay />}
                    {status === 'locked' && <FaLock />}
                  </div>
                  <div className="step-content">
                    <h4>{step.stepTitle}</h4>
                    <p>{step.stepDescription}</p>
                  </div>
                  <div className="step-number">{index + 1}</div>
                </motion.div>
                
                {!isLastStep && (
                  <div className={`step-connector ${status === 'completed' ? 'completed' : ''}`}>
                    <FaChevronRight />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="my-learning-progress">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your learning progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-learning-progress fade-in">
      <div className="roadmaps-header">
        <div className="header-content">
          <h1>My Learning Progress</h1>
          <p>Track your learning journey, view completed roadmaps, and continue your progress</p>
        </div>
      </div>

      {!selectedRoadmap ? (
        <div className="progress-dashboard">
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>{roadmaps.length}</h3>
              <p>Active Roadmaps</p>
            </div>
            <div className="stat-card">
              <h3>{Object.values(userProgress).filter(p => p.progress === 100).length}</h3>
              <p>Completed</p>
            </div>
            <div className="stat-card">
              <h3>{Object.values(userProgress).filter(p => p.progress > 0 && p.progress < 100).length}</h3>
              <p>In Progress</p>
            </div>
            <div className="stat-card">
              <h3>{Math.round(Object.values(userProgress).reduce((acc, p) => acc + p.progress, 0) / Math.max(roadmaps.length, 1))}%</h3>
              <p>Overall Progress</p>
            </div>
          </div>
          
          <div className="roadmaps-grid">
            {roadmaps.map((roadmap, index) => {
              const progress = userProgress[roadmap._id] || { progress: 0, completedSteps: [] };
              
              return (
                <motion.div
                  key={roadmap._id}
                  className="roadmap-preview-card modern-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedRoadmap(roadmap)}
                >
                  <div className="card-header">
                    <h3 className="card-title">{roadmap.title}</h3>
                    <div className="roadmap-meta">
                      <span 
                        className="difficulty-badge"
                        style={{ color: getDifficultyColor(roadmap.difficulty) }}
                      >
                        {roadmap.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <div className="roadmap-stats">
                      <div className="stat-item">
                        <FaClock />
                        <span>{roadmap.estimatedTimeToComplete}</span>
                      </div>
                      <div className="stat-item">
                        <FaStar />
                        <span>{roadmap.techStack}</span>
                      </div>
                      <div className="stat-item">
                        <FaUsers />
                        <span>{roadmap.roadmapSteps.length} Steps</span>
                      </div>
                    </div>
                    
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Your Progress</span>
                        <span>{progress.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${progress.progress}%` }}
                        />
                      </div>
                      <div className="progress-details">
                        {progress.completedSteps.length} of {roadmap.roadmapSteps.length} steps completed
                      </div>
                    </div>
                    
                    <div className="roadmap-preview">
                      <h4>Learning Path Preview</h4>
                      <div className="steps-preview">
                        {roadmap.roadmapSteps.slice(0, 3).map((step, stepIndex) => (
                          <div key={stepIndex} className="preview-step">
                            <div className={`step-indicator ${progress.completedSteps.includes(stepIndex) ? 'completed' : ''}`}>
                              {progress.completedSteps.includes(stepIndex) ? <FaCheck /> : stepIndex + 1}
                            </div>
                            <span>{step.stepTitle}</span>
                          </div>
                        ))}
                        {roadmap.roadmapSteps.length > 3 && (
                          <div className="more-steps">
                            +{roadmap.roadmapSteps.length - 3} more steps
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <div className="roadmap-actions">
                      <button 
                        className="btn btn-primary start-roadmap-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (progress.progress === 0) {
                            handleStartRoadmap(roadmap._id);
                          } else {
                            setSelectedRoadmap(roadmap);
                          }
                        }}
                      >
                        {progress.progress === 100 ? 'Review Completed' : progress.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                      </button>
                      {progress.progress === 100 && (
                        <div className="completion-badge">
                          <FaTrophy /> Completed!
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="roadmap-detail-view">
          <div className="detail-header">
            <button 
              className="btn btn-outline back-btn"
              onClick={() => setSelectedRoadmap(null)}
            >
              ← Back to Progress
            </button>
            <div className="roadmap-info">
              <h2>{selectedRoadmap.title}</h2>
              <div className="roadmap-badges">
                <span className="badge badge-primary">{selectedRoadmap.techStack}</span>
                <span 
                  className="badge"
                  style={{ color: getDifficultyColor(selectedRoadmap.difficulty) }}
                >
                  {selectedRoadmap.difficulty}
                </span>
                <span className="badge">{selectedRoadmap.estimatedTimeToComplete}</span>
              </div>
            </div>
          </div>
          
          <RoadmapFlowchart roadmap={selectedRoadmap} />
        </div>
      )}

      {roadmaps.length === 0 && !loading && (
        <div className="no-roadmaps">
          <div className="empty-state">
            <FaStar className="empty-icon" />
            <h3>No learning progress yet</h3>
            <p>Start your first roadmap from the Explore page to begin tracking your progress!</p>
            <p>Don't worry - you can explore our sample roadmaps below to see how progress tracking works.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearningProgress;
