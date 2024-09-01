// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../componentsCss/Home.css';

function Home() {
  const [categories] = useState([
    'Python Developer', 'Full Stack Developer', 'UI/UX Designer',
    'Data Science', 'ML Engineer', 'DevOps',
    'Web Development', 'MLOps', 'SQL', 'DBMS'
  ]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roadmaps, setRoadmaps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roadmapsPerPage = 5; // Adjust as needed

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await axios.get('/api/roadmaps', {
          params: {
            category: selectedCategory,
            search: searchQuery,
          },
        });
        setRoadmaps(response.data);
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      }
    };

    fetchRoadmaps();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const indexOfLastRoadmap = currentPage * roadmapsPerPage;
  const indexOfFirstRoadmap = indexOfLastRoadmap - roadmapsPerPage;
  const currentRoadmaps = roadmaps.slice(indexOfFirstRoadmap, indexOfLastRoadmap);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home-container">
      <h1>Explore Roadmaps</h1>
      
      <div className="category-selection">
        <label>Select Category:</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for roadmaps..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="roadmap-cards">
        {currentRoadmaps.map((roadmap, index) => (
          <div key={index} className="card" onClick={() => window.open(`/roadmap/${roadmap._id}`, '_blank')}>
            <h2>{roadmap.title}</h2>
            <p>{roadmap.description}</p>
            <p>Tech Stack: {roadmap.techStack}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array(Math.ceil(roadmaps.length / roadmapsPerPage)).fill().map((_, i) => (
          <button key={i} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      <footer className="footer">
        <p>&copy; 2024 Road2Skill. All rights reserved.</p>
        <p>Contact us: info@road2skill.com</p>
      </footer>
    </div>
  );
}

export default Home;
