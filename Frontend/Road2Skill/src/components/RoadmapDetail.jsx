// src/components/RoadmapDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../componentsCss/RoadmapDetail.css'; // Create this CSS file for styling

function RoadmapDetail() {
  const { id } = useParams(); // Get the roadmap ID from the URL
  const [roadmap, setRoadmap] = useState(null);

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

  if (!roadmap) {
    return <div>Loading...</div>;
  }

  return (
    <div className="roadmap-detail">
      <h1>{roadmap.title}</h1>
      <p><strong>Contributor:</strong> {roadmap.contributorName}</p>
      <p><strong>Tech Stack:</strong> {roadmap.techStack}</p>
      <p><strong>Description:</strong> {roadmap.roadmapDescription}</p>
      <div>
        <h2>Steps:</h2>
        {roadmap.roadmapSteps.map((step, index) => (
          <div key={index}>
            <h3>{step.stepTitle}</h3>
            <p>{step.stepDescription}</p>
            <ul>
              {step.resources.map((resource, resIndex) => (
                <li key={resIndex}><a href={resource} target="_blank" rel="noopener noreferrer">{resource}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p><strong>Difficulty Level:</strong> {roadmap.difficultyLevel}</p>
      <p><strong>Estimated Time to Complete:</strong> {roadmap.estimatedTimeToComplete}</p>
      <p><strong>Tags:</strong> {roadmap.tags.join(', ')}</p>
    </div>
  );
}

export default RoadmapDetail;
