import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaThumbsUp, FaThumbsDown, FaBriefcase, FaFileAlt, FaUsers, FaLightbulb, FaGraduationCap, FaTimes, FaCalendar, FaUser, FaTags, FaEye } from 'react-icons/fa';
import axios from 'axios';
import '../componentsCss/CareerGuidance.css';

const CareerGuidance = () => {
  const [guidance, setGuidance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuidance, setSelectedGuidance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    experienceLevel: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Topics', icon: <FaLightbulb /> },
    { id: 'resume', name: 'Resume Tips', icon: <FaFileAlt /> },
    { id: 'interview', name: 'Interview Prep', icon: <FaBriefcase /> },
    { id: 'portfolio', name: 'Portfolio', icon: <FaGraduationCap /> },
    { id: 'networking', name: 'Networking', icon: <FaUsers /> },
    { id: 'job-search', name: 'Job Search', icon: <FaSearch /> },
    { id: 'career-change', name: 'Career Change', icon: <FaLightbulb /> }
  ];

  const experienceLevels = [
    { id: 'all', name: 'All Levels' },
    { id: 'entry', name: 'Entry Level' },
    { id: 'mid', name: 'Mid Level' },
    { id: 'senior', name: 'Senior Level' }
  ];

  useEffect(() => {
    fetchGuidance();
  }, [filters, searchQuery]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const fetchGuidance = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/career-guidance', {
        params: {
          category: filters.category,
          experienceLevel: filters.experienceLevel,
          search: searchQuery
        }
      });
      setGuidance(response.data.guidance || []);
    } catch (error) {
      console.error('Error fetching career guidance:', error);
      // Mock data for development
      setGuidance([
        {
          _id: '1',
          title: 'How to Write a Compelling Developer Resume',
          content: 'Your resume is your first impression. Here are key tips to make it stand out: 1. Start with a strong summary that highlights your key skills and experience. 2. Use action verbs and quantify your achievements. 3. Include relevant technical skills and projects. 4. Keep it concise and well-formatted.',
          category: 'resume',
          experienceLevel: 'entry',
          targetRole: 'Software Developer',
          author: { username: 'career_coach', profile: { firstName: 'Sarah', lastName: 'Johnson' } },
          upvotes: [{ user: 'user1' }, { user: 'user2' }, { user: 'user3' }],
          downvotes: [],
          tags: ['resume', 'tips', 'developer'],
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          _id: '2',
          title: 'Ace Your Technical Interview: A Complete Guide',
          content: 'Technical interviews can be challenging, but with proper preparation, you can succeed. Focus on: 1. Data structures and algorithms practice. 2. System design concepts for senior roles. 3. Behavioral questions preparation. 4. Code review and debugging skills. 5. Ask thoughtful questions about the role and company.',
          category: 'interview',
          experienceLevel: 'mid',
          targetRole: 'Full Stack Developer',
          author: { username: 'tech_mentor', profile: { firstName: 'Mike', lastName: 'Chen' } },
          upvotes: [{ user: 'user1' }, { user: 'user2' }],
          downvotes: [],
          tags: ['interview', 'technical', 'preparation'],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          _id: '3',
          title: 'Building a Portfolio That Gets You Hired',
          content: 'A strong portfolio showcases your skills and creativity. Include: 1. 3-5 diverse projects that demonstrate different skills. 2. Clean, responsive design and user-friendly navigation. 3. Detailed project descriptions with technologies used. 4. Live demos and source code links. 5. About section with your story and contact information.',
          category: 'portfolio',
          experienceLevel: 'entry',
          targetRole: 'Frontend Developer',
          author: { username: 'design_guru', profile: { firstName: 'Alex', lastName: 'Rivera' } },
          upvotes: [{ user: 'user1' }, { user: 'user2' }, { user: 'user3' }, { user: 'user4' }],
          downvotes: [],
          tags: ['portfolio', 'projects', 'showcase'],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (guidanceId, voteType) => {
    try {
      // API call to vote on guidance
      console.log(`${voteType} guidance:`, guidanceId);
    } catch (error) {
      console.error('Error voting on guidance:', error);
    }
  };

  const handleReadMore = (guidanceItem) => {
    setSelectedGuidance(guidanceItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGuidance(null);
  };

  const formatContent = (content) => {
    // Split content by double newlines for paragraphs and format bullet points
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.includes('**') || paragraph.includes('*')) {
        // Handle bold text and bullet points
        const lines = paragraph.split('\n');
        return (
          <div key={index} className="content-section">
            {lines.map((line, lineIndex) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                // Bold headers
                return <h4 key={lineIndex} className="content-header">{line.replace(/\*\*/g, '')}</h4>;
              } else if (line.startsWith('- ')) {
                // Bullet points
                return <li key={lineIndex} className="content-bullet">{line.substring(2)}</li>;
              } else if (line.trim().startsWith('*') && line.trim().endsWith('*')) {
                // Italicized text
                return <em key={lineIndex} className="content-emphasis">{line.replace(/\*/g, '')}</em>;
              } else if (line.trim()) {
                return <p key={lineIndex} className="content-paragraph">{line}</p>;
              }
              return null;
            }).filter(Boolean)}
          </div>
        );
      } else {
        return <p key={index} className="content-paragraph">{paragraph}</p>;
      }
    });
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : <FaLightbulb />;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInDays = Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="career-guidance">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading career guidance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="career-guidance fade-in">
      <div className="guidance-header">
        <div className="header-content">
          <h1>Career Guidance</h1>
          <p>Expert advice to accelerate your career journey</p>
        </div>
      </div>

      <div className="guidance-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search career advice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Experience Level</label>
            <select
              value={filters.experienceLevel}
              onChange={(e) => setFilters({...filters, experienceLevel: e.target.value})}
              className="filter-select"
            >
              {experienceLevels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="guidance-grid">
        {guidance.map((item, index) => (
          <motion.div
            key={item._id}
            className="guidance-card modern-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="guidance-header-card">
              <div className="guidance-meta">
                <div className="category-badge">
                  {getCategoryIcon(item.category)}
                  <span>{item.category.replace('-', ' ')}</span>
                </div>
                <span className="experience-level">{item.experienceLevel} level</span>
              </div>
              <div className="guidance-votes">
                <button 
                  className="vote-btn upvote"
                  onClick={() => handleVote(item._id, 'upvote')}
                >
                  <FaThumbsUp />
                  <span>{item.upvotes?.length || 0}</span>
                </button>
                <button 
                  className="vote-btn downvote"
                  onClick={() => handleVote(item._id, 'downvote')}
                >
                  <FaThumbsDown />
                  <span>{item.downvotes?.length || 0}</span>
                </button>
              </div>
            </div>

            <div className="guidance-content">
              <h3 className="guidance-title">{item.title}</h3>
              {item.targetRole && (
                <p className="target-role">For: {item.targetRole}</p>
              )}
              <div className="guidance-text">
                {item.content.length > 200 ? (
                  <>
                    {item.content.substring(0, 200)}...
                    <button 
                      className="read-more-btn"
                      onClick={() => handleReadMore(item)}
                    >
                      Read More
                    </button>
                  </>
                ) : (
                  <div className="formatted-content">
                    {formatContent(item.content)}
                  </div>
                )}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="guidance-tags">
                  {item.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="guidance-footer">
              <div className="author-info">
                <img
                  src={`https://ui-avatars.com/api/?name=${item.author?.username || 'Anonymous'}&background=6366f1&color=fff`}
                  alt={item.author?.username || 'Anonymous'}
                  className="author-avatar"
                />
                <div>
                  <span className="author-name">
                    {item.author ? 
                      (item.author.profile?.firstName && item.author.profile?.lastName) ? 
                        `${item.author.profile.firstName} ${item.author.profile.lastName}` : 
                        item.author.username 
                      : 'Anonymous'}
                  </span>
                  <span className="publish-date">{formatTimeAgo(item.createdAt)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {guidance.length === 0 && (
        <div className="no-guidance">
          <div className="empty-state">
            <FaBriefcase className="empty-icon" />
            <h3>No guidance found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        </div>
      )}

      {/* Featured Career Tips Section */}
      <div className="featured-tips">
        <h2>Quick Career Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <h4>Network Actively</h4>
            <p>Build relationships in your industry through events, online communities, and professional platforms.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📚</div>
            <h4>Keep Learning</h4>
            <p>Stay updated with the latest technologies and industry trends through continuous learning.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4>Set Clear Goals</h4>
            <p>Define your career objectives and create a roadmap to achieve them step by step.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🤝</div>
            <h4>Seek Mentorship</h4>
            <p>Find experienced professionals who can guide you and provide valuable insights.</p>
          </div>
        </div>
      </div>

      {/* Professional Guidance Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedGuidance && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="guidance-modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-title-section">
                  <div className="modal-category-badge">
                    {getCategoryIcon(selectedGuidance.category)}
                    <span>{selectedGuidance.category.replace('-', ' ')}</span>
                  </div>
                  <h2 className="modal-title">{selectedGuidance.title}</h2>
                  {selectedGuidance.targetRole && (
                    <p className="modal-target-role">
                      <FaBriefcase className="role-icon" />
                      Target Role: {selectedGuidance.targetRole}
                    </p>
                  )}
                </div>
                <button className="modal-close-btn" onClick={closeModal}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-meta">
                <div className="meta-item">
                  <FaUser className="meta-icon" />
                  <span>
                    {selectedGuidance.author ? 
                      (selectedGuidance.author.profile?.firstName && selectedGuidance.author.profile?.lastName) 
                        ? `${selectedGuidance.author.profile.firstName} ${selectedGuidance.author.profile.lastName}` 
                        : selectedGuidance.author.username
                      : 'Anonymous'}
                  </span>
                </div>
                <div className="meta-item">
                  <FaCalendar className="meta-icon" />
                  <span>{formatTimeAgo(selectedGuidance.createdAt)}</span>
                </div>
                <div className="meta-item">
                  <FaGraduationCap className="meta-icon" />
                  <span>{selectedGuidance.experienceLevel} Level</span>
                </div>
                <div className="meta-voting">
                  <button 
                    className="modal-vote-btn upvote"
                    onClick={() => handleVote(selectedGuidance._id, 'upvote')}
                  >
                    <FaThumbsUp />
                    <span>{selectedGuidance.upvotes?.length || 0}</span>
                  </button>
                  <button 
                    className="modal-vote-btn downvote"
                    onClick={() => handleVote(selectedGuidance._id, 'downvote')}
                  >
                    <FaThumbsDown />
                    <span>{selectedGuidance.downvotes?.length || 0}</span>
                  </button>
                </div>
              </div>

              <div className="modal-content">
                <div className="formatted-full-content">
                  {formatContent(selectedGuidance.content)}
                </div>
              </div>

              {selectedGuidance.tags && selectedGuidance.tags.length > 0 && (
                <div className="modal-tags">
                  <FaTags className="tags-icon" />
                  <div className="tags-list">
                    {selectedGuidance.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="modal-tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <div className="footer-stats">
                  <span className="stat-item">
                    <FaEye className="stat-icon" />
                    Professional Career Guidance
                  </span>
                </div>
                <button className="close-modal-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerGuidance;
