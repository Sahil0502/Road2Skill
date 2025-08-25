import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaStar, FaBookmark, FaExternalLinkAlt, FaPlay, FaBook, FaCode, FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import '../componentsCss/ResourceHub.css';

const ResourceHub = ({ searchQuery }) => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    difficulty: 'all'
  });
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

  const categories = [
    'all', 'Web Development', 'Data Science', 'Mobile Development', 
    'DevOps', 'Machine Learning', 'UI/UX Design', 'Backend Development'
  ];

  const types = [
    'all', 'video', 'article', 'course', 'book', 'tool', 'documentation', 'tutorial'
  ];

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, filters, localSearchQuery, searchQuery]);

  useEffect(() => {
    if (searchQuery !== localSearchQuery) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/resources');
      setResources(response.data.resources || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Mock data for development
      setResources([
        {
          _id: '1',
          title: 'React Complete Guide',
          description: 'Comprehensive guide to learning React from basics to advanced concepts',
          url: 'https://example.com/react-guide',
          type: 'course',
          category: 'Web Development',
          difficulty: 'Intermediate',
          duration: '40 hours',
          rating: { average: 4.8, count: 1250 },
          submittedBy: { username: 'john_doe' }
        },
        {
          _id: '2',
          title: 'Python for Data Science',
          description: 'Learn Python programming specifically for data science applications',
          url: 'https://example.com/python-ds',
          type: 'video',
          category: 'Data Science',
          difficulty: 'Beginner',
          duration: '15 hours',
          rating: { average: 4.6, count: 890 },
          submittedBy: { username: 'data_guru' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(resource => resource.category === filters.category);
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(resource => resource.type === filters.type);
    }

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(resource => resource.difficulty === filters.difficulty);
    }

    // Apply search query
    const query = localSearchQuery || searchQuery;
    if (query) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.description.toLowerCase().includes(query.toLowerCase()) ||
        resource.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <FaPlay />;
      case 'course': return <FaGraduationCap />;
      case 'book': return <FaBook />;
      case 'tool': return <FaCode />;
      default: return <FaBook />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'var(--accent-color)';
      case 'Intermediate': return 'var(--secondary-color)';
      case 'Advanced': return '#ef4444';
      default: return 'var(--text-secondary)';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="resource-hub">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resource-hub fade-in">
      <div className="resource-header">
        <div className="header-content">
          <h1>Resource Hub</h1>
          <p>Discover curated learning resources to accelerate your journey</p>
        </div>
        
        <div className="resource-search">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search resources..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="resource-filters">
        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="filter-select"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            className="filter-select"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Levels' : difficulty}
              </option>
            ))}
          </select>
        </div>

        <div className="results-count">
          {filteredResources.length} resources found
        </div>
      </div>

      <div className="resources-grid">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource._id}
            className="resource-card modern-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="resource-header-card">
              <div className="resource-type">
                {getTypeIcon(resource.type)}
                <span>{resource.type}</span>
              </div>
              <button className="bookmark-btn" title="Bookmark">
                <FaBookmark />
              </button>
            </div>

            <div className="resource-content">
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>
              
              <div className="resource-meta">
                <span className="resource-category">{resource.category}</span>
                <span 
                  className="resource-difficulty"
                  style={{ color: getDifficultyColor(resource.difficulty) }}
                >
                  {resource.difficulty}
                </span>
                {resource.duration && (
                  <span className="resource-duration">{resource.duration}</span>
                )}
              </div>

              {resource.rating && (
                <div className="resource-rating">
                  <div className="stars">
                    {renderStars(resource.rating.average)}
                  </div>
                  <span className="rating-text">
                    {resource.rating.average} ({resource.rating.count} reviews)
                  </span>
                </div>
              )}

              <div className="resource-footer">
                <span className="submitted-by">
                  by {resource.submittedBy?.username}
                </span>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary resource-link"
                >
                  View Resource <FaExternalLinkAlt />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="no-resources">
          <div className="empty-state">
            <FaBook className="empty-icon" />
            <h3>No resources found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceHub;
