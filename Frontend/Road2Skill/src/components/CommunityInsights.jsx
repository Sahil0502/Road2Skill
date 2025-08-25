import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaHeart, FaComment, FaShare, FaEye, FaThumbtack, FaCheckCircle, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import '../componentsCss/CommunityInsights.css';

const CommunityInsights = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'discussion',
    tags: ''
  });

  const categories = [
    { id: 'all', name: 'All Posts', icon: '📋' },
    { id: 'question', name: 'Questions', icon: '❓' },
    { id: 'showcase', name: 'Showcase', icon: '🎨' },
    { id: 'discussion', name: 'Discussion', icon: '💬' },
    { id: 'resource', name: 'Resources', icon: '📚' },
    { id: 'achievement', name: 'Achievements', icon: '🏆' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/community/posts', {
        params: {
          category: activeCategory,
          search: searchQuery
        }
      });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Mock data for development
      setPosts([
        {
          _id: '1',
          title: 'How to get started with React?',
          content: 'I\'m new to React and looking for the best resources to begin my journey. Any recommendations?',
          category: 'question',
          author: { username: 'newbie_dev', profile: { firstName: 'John', lastName: 'Doe' } },
          likes: [{ user: 'user1' }, { user: 'user2' }],
          comments: [
            { author: { username: 'react_expert' }, content: 'Start with the official React docs!' },
            { author: { username: 'mentor_mike' }, content: 'I recommend React for Beginners course' }
          ],
          views: 45,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          tags: ['react', 'beginner', 'help']
        },
        {
          _id: '2',
          title: 'My First Full-Stack Project!',
          content: 'Just completed my first MERN stack project - a task management app. Excited to share!',
          category: 'showcase',
          author: { username: 'proud_coder', profile: { firstName: 'Sarah', lastName: 'Wilson' } },
          likes: [{ user: 'user1' }, { user: 'user2' }, { user: 'user3' }],
          comments: [
            { author: { username: 'senior_dev' }, content: 'Congratulations! Looks great!' }
          ],
          views: 78,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          tags: ['mern', 'project', 'showcase'],
          isPinned: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...newPost,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      const response = await axios.post('/api/community/posts', postData);
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', content: '', category: 'discussion', tags: '' });
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      // API call to like/unlike post
      console.log('Liking post:', postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '📋';
  };

  if (loading) {
    return (
      <div className="community-insights">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="community-insights fade-in">
      <div className="community-header">
        <div className="header-content">
          <h1>Community Insights</h1>
          <p>Connect, share, and learn together with fellow learners</p>
        </div>
        
        <button 
          className="btn btn-primary create-post-btn"
          onClick={() => setShowCreatePost(true)}
        >
          <FaPlus /> Create Post
        </button>
      </div>

      <div className="community-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="posts-container">
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            className={`post-card modern-card ${post.isPinned ? 'pinned' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="post-header">
              <div className="post-author">
                <img
                  src={`https://ui-avatars.com/api/?name=${post.author.username}&background=6366f1&color=fff`}
                  alt={post.author.username}
                  className="author-avatar"
                />
                <div className="author-info">
                  <h4>{(post.author.profile?.firstName && post.author.profile?.lastName) ? `${post.author.profile.firstName} ${post.author.profile.lastName}` : post.author.username}</h4>
                  <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
              
              <div className="post-meta">
                <span className="post-category">
                  {getCategoryIcon(post.category)} {post.category}
                </span>
                {post.isPinned && <FaThumbtack className="pin-icon" />}
                {post.isResolved && <FaCheckCircle className="resolved-icon" />}
              </div>
            </div>

            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-text">{post.content}</p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="post-actions">
              <div className="action-buttons">
                <button 
                  className="action-btn like-btn"
                  onClick={() => handleLikePost(post._id)}
                >
                  <FaHeart /> {post.likes?.length || 0}
                </button>
                
                <button className="action-btn comment-btn">
                  <FaComment /> {post.comments?.length || 0}
                </button>
                
                <button className="action-btn view-btn">
                  <FaEye /> {post.views || 0}
                </button>
                
                <button className="action-btn share-btn">
                  <FaShare />
                </button>
              </div>
            </div>

            {post.comments && post.comments.length > 0 && (
              <div className="post-comments">
                <h5>Recent Comments</h5>
                {post.comments.slice(0, 2).map((comment, commentIndex) => (
                  <div key={commentIndex} className="comment">
                    <strong>@{comment.author.username}</strong>
                    <span>{comment.content}</span>
                  </div>
                ))}
                {post.comments.length > 2 && (
                  <button className="view-all-comments">
                    View all {post.comments.length} comments
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="no-posts">
          <div className="empty-state">
            <FaComment className="empty-icon" />
            <h3>No posts found</h3>
            <p>Be the first to start a conversation!</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreatePost(true)}
            >
              Create First Post
            </button>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="modal-overlay" onClick={() => setShowCreatePost(false)}>
          <motion.div
            className="create-post-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Create New Post</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreatePost(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreatePost} className="create-post-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter post title..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                >
                  {categories.filter(c => c.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Share your thoughts..."
                  rows="6"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                  placeholder="react, javascript, help"
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowCreatePost(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Post
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CommunityInsights;
