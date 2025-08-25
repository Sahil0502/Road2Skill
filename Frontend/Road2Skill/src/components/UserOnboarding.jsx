import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCode, FaDesktop, FaDatabase, FaMobile, FaRobot, FaChartLine, FaShieldAlt, FaCloud, FaGamepad, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import '../componentsCss/UserOnboarding.css';

const UserOnboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    experience: '',
    domains: [],
    currentStudy: '',
    goals: [],
    timeCommitment: '',
    preferredLearningStyle: '',
    currentSkills: [],
    careerStage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      title: "Welcome to Road2Skill!",
      subtitle: "Let's personalize your learning journey",
      type: "welcome"
    },
    {
      title: "What's your experience level?",
      subtitle: "This helps us recommend appropriate content",
      type: "experience"
    },
    {
      title: "Which domains interest you?",
      subtitle: "Select all that apply",
      type: "domains"
    },
    {
      title: "What are you currently studying?",
      subtitle: "Tell us about your current focus",
      type: "currentStudy"
    },
    {
      title: "What are your learning goals?",
      subtitle: "Select your primary objectives",
      type: "goals"
    },
    {
      title: "How much time can you dedicate?",
      subtitle: "Help us plan your learning schedule",
      type: "timeCommitment"
    },
    {
      title: "What's your preferred learning style?",
      subtitle: "We'll tailor content to match your preferences",
      type: "learningStyle"
    },
    {
      title: "Current skills assessment",
      subtitle: "Rate your current skill level",
      type: "skills"
    }
  ];

  const experienceOptions = [
    { value: 'beginner', label: 'Complete Beginner', desc: 'New to programming/tech' },
    { value: 'some-knowledge', label: 'Some Knowledge', desc: 'Basic understanding, limited practice' },
    { value: 'intermediate', label: 'Intermediate', desc: '1-3 years experience' },
    { value: 'advanced', label: 'Advanced', desc: '3+ years experience' },
    { value: 'expert', label: 'Expert', desc: 'Senior level, mentoring others' }
  ];

  const domainOptions = [
    { value: 'web-development', label: 'Web Development', icon: FaDesktop },
    { value: 'mobile-development', label: 'Mobile Development', icon: FaMobile },
    { value: 'data-science', label: 'Data Science', icon: FaChartLine },
    { value: 'machine-learning', label: 'Machine Learning/AI', icon: FaRobot },
    { value: 'cybersecurity', label: 'Cybersecurity', icon: FaShieldAlt },
    { value: 'cloud-computing', label: 'Cloud Computing', icon: FaCloud },
    { value: 'database', label: 'Database Management', icon: FaDatabase },
    { value: 'game-development', label: 'Game Development', icon: FaGamepad },
    { value: 'devops', label: 'DevOps', icon: FaCode }
  ];

  const goalOptions = [
    { value: 'career-change', label: 'Career Change', desc: 'Switch to tech career' },
    { value: 'skill-upgrade', label: 'Skill Upgrade', desc: 'Enhance current skills' },
    { value: 'certification', label: 'Get Certified', desc: 'Earn industry certifications' },
    { value: 'freelancing', label: 'Start Freelancing', desc: 'Work as a freelancer' },
    { value: 'startup', label: 'Build a Startup', desc: 'Create your own product' },
    { value: 'promotion', label: 'Get Promoted', desc: 'Advance in current role' }
  ];

  const timeCommitmentOptions = [
    { value: '1-3', label: '1-3 hours/week', desc: 'Casual learning' },
    { value: '4-7', label: '4-7 hours/week', desc: 'Steady progress' },
    { value: '8-15', label: '8-15 hours/week', desc: 'Serious commitment' },
    { value: '16+', label: '16+ hours/week', desc: 'Intensive learning' }
  ];

  const learningStyleOptions = [
    { value: 'visual', label: 'Visual Learner', desc: 'Videos, diagrams, infographics' },
    { value: 'hands-on', label: 'Hands-on Learner', desc: 'Projects, coding exercises' },
    { value: 'reading', label: 'Reading/Text', desc: 'Articles, documentation, books' },
    { value: 'mixed', label: 'Mixed Approach', desc: 'Combination of all methods' }
  ];

  const skillOptions = [
    'HTML/CSS', 'JavaScript', 'Python', 'Java', 'React', 'Node.js', 
    'SQL', 'Git', 'Linux', 'AWS', 'Docker', 'MongoDB'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Use session-based authentication with credentials
      await axios.post('/api/user/onboarding', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Generate initial recommendations
      await axios.post('/api/recommendations/generate', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      onComplete(formData);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.type) {
      case 'welcome':
        return (
          <div className="welcome-content">
            <div className="welcome-icon">
              <FaGraduationCap size={80} />
            </div>
            <p>We'll ask you a few questions to create a personalized learning experience tailored just for you.</p>
            <ul className="welcome-features">
              <li>✨ Personalized roadmap recommendations</li>
              <li>🎯 Curated learning resources</li>
              <li>📺 YouTube video suggestions</li>
              <li>📝 AI-generated study notes</li>
              <li>🏆 Achievement tracking</li>
            </ul>
          </div>
        );

      case 'experience':
        return (
          <div className="options-grid">
            {experienceOptions.map(option => (
              <motion.div
                key={option.value}
                className={`option-card ${formData.experience === option.value ? 'selected' : ''}`}
                onClick={() => handleInputChange('experience', option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4>{option.label}</h4>
                <p>{option.desc}</p>
              </motion.div>
            ))}
          </div>
        );

      case 'domains':
        return (
          <div className="domains-grid">
            {domainOptions.map(option => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.value}
                  className={`domain-card ${formData.domains.includes(option.value) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('domains', option.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent size={40} />
                  <h4>{option.label}</h4>
                </motion.div>
              );
            })}
          </div>
        );

      case 'currentStudy':
        return (
          <div className="text-input-section">
            <textarea
              placeholder="Tell us what you're currently studying, working on, or interested in learning..."
              value={formData.currentStudy}
              onChange={(e) => handleInputChange('currentStudy', e.target.value)}
              rows={4}
              className="study-textarea"
            />
            <div className="input-examples">
              <p>Examples:</p>
              <ul>
                <li>"Learning React for web development"</li>
                <li>"Computer Science degree, focusing on algorithms"</li>
                <li>"Self-taught Python, want to get into data science"</li>
              </ul>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="goals-grid">
            {goalOptions.map(option => (
              <motion.div
                key={option.value}
                className={`goal-card ${formData.goals.includes(option.value) ? 'selected' : ''}`}
                onClick={() => handleMultiSelect('goals', option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4>{option.label}</h4>
                <p>{option.desc}</p>
              </motion.div>
            ))}
          </div>
        );

      case 'timeCommitment':
        return (
          <div className="time-grid">
            {timeCommitmentOptions.map(option => (
              <motion.div
                key={option.value}
                className={`time-card ${formData.timeCommitment === option.value ? 'selected' : ''}`}
                onClick={() => handleInputChange('timeCommitment', option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4>{option.label}</h4>
                <p>{option.desc}</p>
              </motion.div>
            ))}
          </div>
        );

      case 'learningStyle':
        return (
          <div className="learning-style-grid">
            {learningStyleOptions.map(option => (
              <motion.div
                key={option.value}
                className={`style-card ${formData.preferredLearningStyle === option.value ? 'selected' : ''}`}
                onClick={() => handleInputChange('preferredLearningStyle', option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4>{option.label}</h4>
                <p>{option.desc}</p>
              </motion.div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div className="skills-section">
            <p>Select skills you already have experience with:</p>
            <div className="skills-grid">
              {skillOptions.map(skill => (
                <motion.div
                  key={skill}
                  className={`skill-tag ${formData.currentSkills.includes(skill) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('currentSkills', skill)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepComplete = () => {
    const step = steps[currentStep];
    switch (step.type) {
      case 'welcome':
        return true;
      case 'experience':
        return formData.experience !== '';
      case 'domains':
        return formData.domains.length > 0;
      case 'currentStudy':
        return formData.currentStudy.trim() !== '';
      case 'goals':
        return formData.goals.length > 0;
      case 'timeCommitment':
        return formData.timeCommitment !== '';
      case 'learningStyle':
        return formData.preferredLearningStyle !== '';
      case 'skills':
        return true; // Optional step
      default:
        return false;
    }
  };

  return (
    <div className="user-onboarding">
      <div className="onboarding-container">
        <div className="progress-header">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        <motion.div
          key={currentStep}
          className="step-content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="step-header">
            <h2>{steps[currentStep].title}</h2>
            <p>{steps[currentStep].subtitle}</p>
          </div>

          <div className="step-body">
            {renderStepContent()}
          </div>
        </motion.div>

        <div className="step-navigation">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="btn btn-outline nav-btn"
          >
            <FaArrowLeft /> Previous
          </button>

          <button
            onClick={nextStep}
            disabled={!isStepComplete()}
            className="btn btn-primary nav-btn"
          >
            {currentStep === steps.length - 1 ? (
              isSubmitting ? 'Creating Profile...' : 'Complete Setup'
            ) : (
              <>Next <FaArrowRight /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;
