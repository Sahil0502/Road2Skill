import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';
import '../componentsCss/ContributionForm.css';

function ContributionForm() {
  const [formData, setFormData] = useState({
    title: '',
    contributorName: '',
    domain: '',
    techStack: '',
    roadmapDescription: '',
    roadmapSteps: [{ stepTitle: '', stepDescription: '', resources: [''] }],
    difficultyLevel: 'Beginner',
    estimatedTimeToComplete: '',
    tags: [''],
    user: '',
  });

  const domainOptions = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'machine-learning', label: 'Machine Learning/AI' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'cloud-computing', label: 'Cloud Computing' },
    { value: 'database', label: 'Database Management' },
    { value: 'game-development', label: 'Game Development' },
    { value: 'devops', label: 'DevOps' }
  ];

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

  const removeStep = (index) => {
    const newSteps = [...formData.roadmapSteps];
    newSteps.splice(index, 1);
    setFormData({ ...formData, roadmapSteps: newSteps });
  };

  const addResource = (stepIndex) => {
    const newSteps = [...formData.roadmapSteps];
    newSteps[stepIndex].resources.push('');
    setFormData({ ...formData, roadmapSteps: newSteps });
  };

  const removeResource = (stepIndex, resourceIndex) => {
    const newSteps = [...formData.roadmapSteps];
    newSteps[stepIndex].resources.splice(resourceIndex, 1);
    setFormData({ ...formData, roadmapSteps: newSteps });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/contributions', formData);
      console.log('Contribution created:', response.data);
      // Handle successful creation, e.g., redirect or show a success message
    } catch (error) {
      console.error('Error creating contribution:', error.response?.data || error.message || error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="contribution-form">
      <h1>Create a Contribution</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="contributorName">Contributor Name</label>
          <input type="text" id="contributorName" name="contributorName" value={formData.contributorName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="domain">Domain</label>
          <select id="domain" name="domain" value={formData.domain} onChange={handleChange} required>
            <option value="">Select a domain</option>
            {domainOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="techStack">Tech Stack</label>
          <input type="text" id="techStack" name="techStack" value={formData.techStack} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="roadmapDescription">Roadmap Description</label>
          <textarea id="roadmapDescription" name="roadmapDescription" value={formData.roadmapDescription} onChange={handleChange} required />
        </div>
        <div className="roadmap-steps">
          <h2>Roadmap Steps</h2>
          {formData.roadmapSteps.map((step, index) => (
            <div key={index} className="step-container">
              <h3>Step {index + 1}</h3>
              <div className="form-group">
                <label htmlFor={`stepTitle-${index}`}>Step Title</label>
                <input type="text" id={`stepTitle-${index}`} name="stepTitle" value={step.stepTitle} onChange={(e) => handleStepChange(index, e)} required />
              </div>
              <div className="form-group">
                <label htmlFor={`stepDescription-${index}`}>Step Description</label>
                <textarea id={`stepDescription-${index}`} name="stepDescription" value={step.stepDescription} onChange={(e) => handleStepChange(index, e)} />
              </div>
              <div className="resources">
                <h4>Resources</h4>
                {step.resources.map((resource, resIndex) => (
                  <div key={resIndex} className="resource-input">
                    <input type="url" value={resource} onChange={(e) => handleResourceChange(index, resIndex, e)} placeholder="Resource URL" />
                    <button type="button" className="remove-btn" onClick={() => removeResource(index, resIndex)}><FaTrash /></button>
                  </div>
                ))}
                <button type="button" className="add-btn" onClick={() => addResource(index)}><FaPlus /> Add Resource</button>
              </div>
              {index > 0 && (
                <button type="button" className="remove-btn" onClick={() => removeStep(index)}><FaTrash /> Remove Step</button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addStep}><FaPlus /> Add Step</button>
        </div>
        <div className="form-group">
          <label htmlFor="difficultyLevel">Difficulty Level</label>
          <select id="difficultyLevel" name="difficultyLevel" value={formData.difficultyLevel} onChange={handleChange} required>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="estimatedTimeToComplete">Estimated Time to Complete</label>
          <input type="text" id="estimatedTimeToComplete" name="estimatedTimeToComplete" value={formData.estimatedTimeToComplete} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input type="text" id="tags" name="tags" value={formData.tags.join(', ')} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })} required />
        </div>
        <button type="submit" className="submit-btn">Submit Contribution</button>
      </form>
    </div>
  );
}

export default ContributionForm;