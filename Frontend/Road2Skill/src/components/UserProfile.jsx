import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEdit, FaTrophy, FaStar, FaCalendar, FaGithub, FaLinkedin, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { useTheme } from '../App';
import '../componentsCss/UserProfile.css';

const UserProfile = ({ user }) => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: ''
  });

  useEffect(() => {
    if (user?.profile) {
      setProfileData(user.profile);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      // API call to update profile
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getBadgeIcon = (category) => {
    switch (category) {
      case 'learning': return '📚';
      case 'contribution': return '🤝';
      case 'community': return '👥';
      default: return '🏆';
    }
  };

  const getXPForNextLevel = (currentXP) => {
    const currentLevel = Math.floor(currentXP / 100) + 1;
    return (currentLevel * 100) - currentXP;
  };

  return (
    <div className="user-profile fade-in">
      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-avatar">
            <img 
              src={user?.profile?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=6366f1&color=fff`}
              alt="Profile"
              className="avatar-image"
            />
            {isEditing && (
              <button className="edit-avatar-btn">
                <FaEdit />
              </button>
            )}
          </div>
          
          <div className="profile-info">
            <div className="profile-name">
              {isEditing ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    placeholder="First Name"
                    className="name-input"
                  />
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    placeholder="Last Name"
                    className="name-input"
                  />
                </div>
              ) : (
                <h1>{(profileData.firstName && profileData.lastName) ? `${profileData.firstName} ${profileData.lastName}` : user?.username}</h1>
              )}
              <p className="username">@{user?.username}</p>
            </div>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{user?.progress?.level || 1}</span>
                <span className="stat-label">Level</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user?.progress?.totalXP || 0}</span>
                <span className="stat-label">XP</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user?.progress?.streak || 0}</span>
                <span className="stat-label">Day Streak</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user?.badges?.length || 0}</span>
                <span className="stat-label">Badges</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            {isEditing ? (
              <div className="edit-actions">
                <button onClick={handleSaveProfile} className="btn btn-primary">Save</button>
                <button onClick={() => setIsEditing(false)} className="btn btn-outline">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-outline">
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="xp-progress">
          <div className="xp-info">
            <span>Level {user?.progress?.level || 1}</span>
            <span>{getXPForNextLevel(user?.progress?.totalXP || 0)} XP to next level</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((user?.progress?.totalXP || 0) % 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Progress
          </button>
          <button 
            className={`tab ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges
          </button>
          <button 
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <motion.div 
              className="overview-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="overview-grid">
                <div className="modern-card">
                  <h3>About</h3>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      className="bio-textarea"
                    />
                  ) : (
                    <p>{profileData.bio || 'No bio available'}</p>
                  )}
                </div>
                
                <div className="modern-card">
                  <h3>Contact & Links</h3>
                  <div className="contact-links">
                    {isEditing ? (
                      <div className="contact-edit">
                        <div className="input-group">
                          <FaMapMarkerAlt />
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                            placeholder="Location"
                          />
                        </div>
                        <div className="input-group">
                          <FaGlobe />
                          <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                            placeholder="Website"
                          />
                        </div>
                        <div className="input-group">
                          <FaGithub />
                          <input
                            type="text"
                            value={profileData.github}
                            onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                            placeholder="GitHub Username"
                          />
                        </div>
                        <div className="input-group">
                          <FaLinkedin />
                          <input
                            type="text"
                            value={profileData.linkedin}
                            onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                            placeholder="LinkedIn Profile"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="contact-display">
                        {profileData.location && (
                          <div className="contact-item">
                            <FaMapMarkerAlt />
                            <span>{profileData.location}</span>
                          </div>
                        )}
                        {profileData.website && (
                          <div className="contact-item">
                            <FaGlobe />
                            <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                              {profileData.website}
                            </a>
                          </div>
                        )}
                        {profileData.github && (
                          <div className="contact-item">
                            <FaGithub />
                            <a href={`https://github.com/${profileData.github}`} target="_blank" rel="noopener noreferrer">
                              {profileData.github}
                            </a>
                          </div>
                        )}
                        {profileData.linkedin && (
                          <div className="contact-item">
                            <FaLinkedin />
                            <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
                              LinkedIn
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div 
              className="progress-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="progress-grid">
                <div className="modern-card">
                  <h3>Completed Roadmaps</h3>
                  <div className="completed-roadmaps">
                    {user?.progress?.completedRoadmaps?.map((roadmap, index) => (
                      <div key={index} className="roadmap-progress-item">
                        <div className="roadmap-info">
                          <h4>{roadmap.roadmapId?.title}</h4>
                          <p>{roadmap.roadmapId?.techStack}</p>
                        </div>
                        <div className="progress-indicator">
                          <div className="progress-bar small">
                            <div 
                              className="progress-fill"
                              style={{ width: `${roadmap.progress}%` }}
                            />
                          </div>
                          <span>{roadmap.progress}%</span>
                        </div>
                      </div>
                    )) || <p>No completed roadmaps yet</p>}
                  </div>
                </div>
                
                <div className="modern-card">
                  <h3>Learning Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <FaTrophy className="stat-icon" />
                      <div>
                        <span className="stat-number">{user?.progress?.completedRoadmaps?.length || 0}</span>
                        <span className="stat-text">Roadmaps Completed</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <FaStar className="stat-icon" />
                      <div>
                        <span className="stat-number">{user?.progress?.totalXP || 0}</span>
                        <span className="stat-text">Total XP Earned</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <FaCalendar className="stat-icon" />
                      <div>
                        <span className="stat-number">{user?.progress?.streak || 0}</span>
                        <span className="stat-text">Day Streak</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'badges' && (
            <motion.div 
              className="badges-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="badges-grid">
                {user?.badges?.map((badge, index) => (
                  <motion.div 
                    key={index}
                    className="badge-card"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="badge-icon">
                      {getBadgeIcon(badge.category)}
                    </div>
                    <h4>{badge.name}</h4>
                    <p>{badge.description}</p>
                    <span className="badge-date">
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </span>
                  </motion.div>
                )) || (
                  <div className="no-badges">
                    <FaTrophy className="empty-icon" />
                    <p>No badges earned yet. Start completing roadmaps to earn your first badge!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div 
              className="activity-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="modern-card">
                <h3>Recent Activity</h3>
                <div className="activity-timeline">
                  <div className="activity-item">
                    <div className="activity-icon">🎯</div>
                    <div className="activity-content">
                      <p><strong>Completed Step 5</strong> in React Developer Roadmap</p>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">🏆</div>
                    <div className="activity-content">
                      <p><strong>Earned badge:</strong> First Steps</p>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">📚</div>
                    <div className="activity-content">
                      <p><strong>Started</strong> Python Developer Roadmap</p>
                      <span className="activity-time">3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
