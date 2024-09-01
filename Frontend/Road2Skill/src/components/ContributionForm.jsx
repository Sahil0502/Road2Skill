// src/components/ContributionForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../componentsCss/ContributionForm.css'; // Assuming you have a CSS file for styling

function ContributionForm() {
  const [formData, setFormData] = useState({
    title: '',
    contributorName: '',
    techStack: '',
    roadmapDescription: '',
    roadmapSteps: [{ stepTitle: '', stepDescription: '', resources: [''] }],
    difficultyLevel: 'Beginner',
    estimatedTimeToComplete: '',
    tags: [''],
    user: '', // This should be set to the current user's ID
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStepChange = (index, e) => {
    const { name, value } = e.target;
    const newSteps = [...formData.roadmapSteps];
    newSteps[index][name] = value;
    setFormData({ ...formData, roadmapSteps: newSteps });
  };

  const handleResourceChange = (stepIndex, resourceIndex, e) => {
    const { value } = e.target;
    const newSteps = [...formData.roadmapSteps];
    newSteps[stepIndex].resources[resourceIndex] = value;
    setFormData({ ...formData, roadmapSteps: newSteps });
  };

  const addStep = () => {
    setFormData((prevState) => ({
      ...prevState,
      roadmapSteps: [...prevState.roadmapSteps, { stepTitle: '', stepDescription: '', resources: [''] }],
    }));
  };

  const addResource = (stepIndex) => {
    const newSteps = [...formData.roadmapSteps];
    newSteps[stepIndex].resources.push('');
    setFormData({ ...formData, roadmapSteps: newSteps });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/contributions', formData);
      console.log('Contribution created:', response.data);
      // Handle successful creation, e.g., redirect or show a success message
    } catch (error) {
      console.error('Error creating contribution:', error.response.data);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="contribution-form">
      <h1>Create a Contribution</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="contributorName">Contributor Name:</label>
          <input type="text" id="contributorName" name="contributorName" value={formData.contributorName} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="techStack">Tech Stack:</label>
          <input type="text" id="techStack" name="techStack" value={formData.techStack} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="roadmapDescription">Roadmap Description:</label>
          <textarea id="roadmapDescription" name="roadmapDescription" value={formData.roadmapDescription} onChange={handleChange} required />
        </div>
        {formData.roadmapSteps.map((step, index) => (
          <div key={index}>
            <h3>Step {index + 1}</h3>
            <label htmlFor={`stepTitle-${index}`}>Step Title:</label>
            <input type="text" id={`stepTitle-${index}`} name="stepTitle" value={step.stepTitle} onChange={(e) => handleStepChange(index, e)} required />
            <label htmlFor={`stepDescription-${index}`}>Step Description:</label>
            <textarea id={`stepDescription-${index}`} name="stepDescription" value={step.stepDescription} onChange={(e) => handleStepChange(index, e)} />
            {step.resources.map((resource, resIndex) => (
              <div key={resIndex}>
                <label htmlFor={`resource-${index}-${resIndex}`}>Resource URL:</label>
                <input type="url" id={`resource-${index}-${resIndex}`} value={resource} onChange={(e) => handleResourceChange(index, resIndex, e)} />
              </div>
            ))}
            <button type="button" onClick={() => addResource(index)}>Add Resource</button>
          </div>
        ))}
        <button type="button" onClick={addStep}>Add Step</button>
        <div>
          <label htmlFor="difficultyLevel">Difficulty Level:</label>
          <select id="difficultyLevel" name="difficultyLevel" value={formData.difficultyLevel} onChange={handleChange} required>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label htmlFor="estimatedTimeToComplete">Estimated Time to Complete:</label>
          <input type="text" id="estimatedTimeToComplete" name="estimatedTimeToComplete" value={formData.estimatedTimeToComplete} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="tags">Tags:</label>
          <input type="text" id="tags" name="tags" value={formData.tags.join(', ')} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })} required />
        </div>
        <button type="submit">Submit Contribution</button>
      </form>
    </div>
  );
}

export default ContributionForm;
