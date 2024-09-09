import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import '../componentsCss/RoadmapDetail.css';

const StepDetail = ({ step, onClose }) => (
  <motion.div
    className="step-detail-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="step-detail"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
    >
      <h3>{step.stepTitle}</h3>
      <p>{step.stepDescription}</p>
      <h4>Resources:</h4>
      <ul className="resource-urls">
        {step.resources.map((resource, resIndex) => (
          <li key={resIndex}>
            <a href={resource} target="_blank" rel="noopener noreferrer">{resource}</a>
          </li>
        ))}
      </ul>
      <button onClick={onClose} className="close-button">
        <FaTimes />
      </button>
    </motion.div>
  </motion.div>
);

const RoadmapDetail = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const stepsPerPage = 4;

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await axios.get(`/api/roadmaps/${id}`);
        setRoadmap(response.data);
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      }
    };

    fetchRoadmap();
  }, [id]);

  const openStepDetail = (step) => setSelectedStep(step);
  const closeStepDetail = () => setSelectedStep(null);

  const handleNext = () => {
    if (roadmap && currentPage < Math.ceil(roadmap.roadmapSteps.length / stepsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!roadmap) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading roadmap...</p>
      </div>
    );
  }

  const startIndex = currentPage * stepsPerPage;
  const endIndex = startIndex + stepsPerPage;
  const currentSteps = roadmap.roadmapSteps.slice(startIndex, endIndex);

  return (
    <div className="roadmap-detail">
      <header className="roadmap-header-wrapper">
        <div className="roadmap-header">
          <h1>{roadmap.title}</h1>
          <div className="roadmap-meta">
            <div className="meta-item">
              <strong>Contributor:</strong> {roadmap.contributorName}
            </div>
            <div className="meta-item">
              <strong>Tech Stack:</strong> {roadmap.techStack}
            </div>
            <div className="meta-item">
              <strong>Difficulty:</strong> {roadmap.difficultyLevel}
            </div>
            <div className="meta-item">
              <strong>Est. Time:</strong> {roadmap.estimatedTimeToComplete}
            </div>
          </div>
        </div>
      </header>
      
      <div className="roadmap-content">
        <section className="roadmap-description">
          <h2>Roadmap Overview</h2>
          <p>{roadmap.roadmapDescription}</p>
        </section>
        
        <section className="steps">
          <h2>Learning Path</h2>
          <div className="steps-container">
            {currentSteps.map((step, index) => (
              <motion.div
                className="step-box"
                key={index}
                onClick={() => openStepDetail(step)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="step-box-inner">
                  <div className="step-number">{startIndex + index + 1}</div>
                  <h3>{step.stepTitle}</h3>
                  <p>{step.stepDescription.length > 100 ? `${step.stepDescription.substring(0, 100)}...` : step.stepDescription}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-button" 
              onClick={handlePrevious} 
              disabled={currentPage === 0}
            >
              <FaChevronLeft /> Previous
            </button>
            <span className="page-indicator">
              Page {currentPage + 1} of {Math.ceil(roadmap.roadmapSteps.length / stepsPerPage)}
            </span>
            <button 
              className="pagination-button" 
              onClick={handleNext} 
              disabled={currentPage >= Math.ceil(roadmap.roadmapSteps.length / stepsPerPage) - 1}
            >
              Next <FaChevronRight />
            </button>
          </div>
        </section>

        <AnimatePresence>
          {selectedStep && (
            <StepDetail step={selectedStep} onClose={closeStepDetail} />
          )}
        </AnimatePresence>

        <footer className="roadmap-footer">
          <p><strong>Tags:</strong> {roadmap.tags.join(', ')}</p>
        </footer>
      </div>
    </div>
  );
};

export default RoadmapDetail;