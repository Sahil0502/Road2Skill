// src/components/RoadmapExplore.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaClock, FaUser, FaStar, FaBookmark, FaPlay, FaTrophy, FaDesktop, FaMobile, FaChartLine, FaRobot, FaShieldAlt, FaCloud, FaDatabase, FaGamepad, FaCode, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { useTheme } from '../App';
import '../componentsCss/RoadmapExplore.css';

function RoadmapExplore() {
  const { darkMode } = useTheme();
  const [roadmaps, setRoadmaps] = useState([]);
  const [roadmapsByDomain, setRoadmapsByDomain] = useState({});
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProgress, setUserProgress] = useState({});
  const [bookmarkedRoadmaps, setBookmarkedRoadmaps] = useState(new Set());

  const domainConfig = {
    'web-development': {
      label: 'Web Development',
      icon: FaDesktop,
      color: '#3498db'
    },
    'mobile-development': {
      label: 'Mobile Development',
      icon: FaMobile,
      color: '#2ecc71'
    },
    'data-science': {
      label: 'Data Science',
      icon: FaChartLine,
      color: '#e74c3c'
    },
    'machine-learning': {
      label: 'Machine Learning/AI',
      icon: FaRobot,
      color: '#9b59b6'
    },
    'cybersecurity': {
      label: 'Cybersecurity',
      icon: FaShieldAlt,
      color: '#e67e22'
    },
    'cloud-computing': {
      label: 'Cloud Computing',
      icon: FaCloud,
      color: '#1abc9c'
    },
    'database': {
      label: 'Database Management',
      icon: FaDatabase,
      color: '#34495e'
    },
    'game-development': {
      label: 'Game Development',
      icon: FaGamepad,
      color: '#f39c12'
    },
    'devops': {
      label: 'DevOps',
      icon: FaCode,
      color: '#16a085'
    }
  };

  useEffect(() => {
    fetchRoadmaps();
    fetchUserProgress();
  }, []);

  useEffect(() => {
    organizeRoadmapsByDomain();
  }, [roadmaps, selectedDomain, selectedDifficulty, searchTerm, sortBy]);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/auth/contributions');
      setRoadmaps(response.data);
    } catch (err) {
      setError('Failed to fetch roadmaps');
      console.error('Error fetching roadmaps:', err);
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
        const progressMap = {};
        response.data.completedRoadmaps?.forEach(roadmap => {
          progressMap[roadmap.roadmapId] = roadmap.progress;
        });
        setUserProgress(progressMap);
        
        // Fetch bookmarked roadmaps
        const profileResponse = await axios.get('http://localhost:3001/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarkedRoadmaps(new Set(profileResponse.data.bookmarkedRoadmaps || []));
      }
    } catch (err) {
      console.error('Error fetching user progress:', err);
    }
  };

  const organizeRoadmapsByDomain = () => {
    let filtered = [...roadmaps];

    // Apply filters
    if (selectedDomain !== 'All') {
      filtered = filtered.filter(roadmap => roadmap.domain === selectedDomain);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(roadmap => roadmap.difficultyLevel === selectedDifficulty);
    }

    if (searchTerm) {
      filtered = filtered.filter(roadmap => 
        roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.roadmapDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    // Group by domain
    const groupedByDomain = {};
    
    if (selectedDomain === 'All') {
      // Show all domains with their roadmaps
      Object.keys(domainConfig).forEach(domain => {
        const domainRoadmaps = filtered.filter(roadmap => roadmap.domain === domain);
        if (domainRoadmaps.length > 0) {
          groupedByDomain[domain] = domainRoadmaps;
        }
      });
    } else {
      // Show only selected domain
      groupedByDomain[selectedDomain] = filtered;
    }

    setRoadmapsByDomain(groupedByDomain);
  };

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const domains = ['All', ...Object.keys(domainConfig)];

  const toggleBookmark = async (roadmapId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const isBookmarked = bookmarkedRoadmaps.has(roadmapId);
      const method = isBookmarked ? 'DELETE' : 'POST';
      
      await axios({
        method,
        url: `http://localhost:3001/api/user/bookmark/${roadmapId}`,
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookmarkedRoadmaps(prev => {
        const newSet = new Set(prev);
        if (isBookmarked) {
          newSet.delete(roadmapId);
        } else {
          newSet.add(roadmapId);
        }
        return newSet;
      });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const RoadmapCard = ({ roadmap }) => {
    const progress = userProgress[roadmap._id] || 0;
    const isBookmarked = bookmarkedRoadmaps.has(roadmap._id);

    return (
      <motion.div
        className="roadmap-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
      >
        <div className="roadmap-card-header">
          <div className="roadmap-meta">
            <span 
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(roadmap.difficultyLevel) }}
            >
              {roadmap.difficultyLevel}
            </span>
            <button
              className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => toggleBookmark(roadmap._id)}
            >
              <FaBookmark />
            </button>
          </div>
          <h3 className="roadmap-title">{roadmap.title}</h3>
          <p className="roadmap-description">{roadmap.roadmapDescription}</p>
        </div>

        <div className="roadmap-card-body">
          <div className="roadmap-stats">
            <div className="stat">
              <FaClock />
              <span>{roadmap.estimatedTimeToComplete || 'N/A'}</span>
            </div>
            <div className="stat">
              <FaUser />
              <span>{roadmap.contributorName || 'Anonymous'}</span>
            </div>
          </div>

          <div className="tech-stack">
            <strong>Tech Stack:</strong> {roadmap.techStack}
          </div>

          {roadmap.tags && (
            <div className="roadmap-tags">
              {roadmap.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
              {roadmap.tags.length > 3 && <span className="tag">+{roadmap.tags.length - 3}</span>}
            </div>
          )}

          {progress > 0 && (
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="progress-text">{progress}% Complete</span>
            </div>
          )}
        </div>

        <div className="roadmap-card-footer">
          <Link to={`/roadmap/${roadmap._id}`} className="view-roadmap-btn">
            <FaPlay /> Start Learning
          </Link>
        </div>
      </motion.div>
    );
  };

  const DomainSection = ({ domain, roadmaps }) => {
    const domainInfo = domainConfig[domain];
    const IconComponent = domainInfo.icon;

    return (
      <motion.div
        className="domain-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="domain-header">
          <div className="domain-title">
            <IconComponent 
              style={{ color: domainInfo.color }} 
              size={24}
            />
            <h2>{domainInfo.label}</h2>
            <span className="roadmap-count">({roadmaps.length} roadmaps)</span>
          </div>
          {selectedDomain === 'All' && (
            <button
              className="view-all-btn"
              onClick={() => setSelectedDomain(domain)}
            >
              View All <FaChevronRight />
            </button>
          )}
        </div>
        
        <div className="roadmaps-grid">
          {roadmaps.slice(0, selectedDomain === 'All' ? 3 : roadmaps.length).map(roadmap => (
            <RoadmapCard key={roadmap._id} roadmap={roadmap} />
          ))}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading roadmaps...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchRoadmaps}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={`roadmap-explore ${darkMode ? 'dark' : ''}`}>
      <div className="explore-header">
        <h1>Explore Learning Roadmaps</h1>
        <p>Discover structured learning paths across different domains</p>
      </div>

      <div className="explore-controls">
        <div className="search-section">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>Domain:</label>
            <select 
              value={selectedDomain} 
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {domains.map(domain => (
                <option key={domain} value={domain}>
                  {domain === 'All' ? 'All Domains' : domainConfig[domain]?.label || domain}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty:</label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      <div className="roadmaps-content">
        {Object.keys(roadmapsByDomain).length === 0 ? (
          <div className="no-results">
            <h3>No roadmaps found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          Object.entries(roadmapsByDomain).map(([domain, domainRoadmaps]) => (
            <DomainSection 
              key={domain} 
              domain={domain} 
              roadmaps={domainRoadmaps} 
            />
          ))
        )}
      </div>
    </div>
  );
}

export default RoadmapExplore;
