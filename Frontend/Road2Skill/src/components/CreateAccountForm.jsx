import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../componentsCss/CreateAccountForm.css";
import signupImage from '../assets/front_page.png';
import axios from 'axios';

function CreateAccountForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    let criteria = {
      length: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password)
    };

    // Only count strength if minimum length is met
    if (criteria.length) {
      strength++; // Base point for length
      if (criteria.hasUpper) strength++;
      if (criteria.hasLower) strength++;
      if (criteria.hasNumber) strength++;
      if (criteria.hasSymbol) strength++;
    }

    return { strength, criteria };
  };

  const getPasswordRequirements = () => {
    if (!formData.password) return null;
    
    const { criteria } = checkPasswordStrength(formData.password);
    return [
      { text: 'At least 8 characters', met: criteria.length },
      { text: 'One uppercase letter (A-Z)', met: criteria.hasUpper },
      { text: 'One lowercase letter (a-z)', met: criteria.hasLower },
      { text: 'One number (0-9)', met: criteria.hasNumber },
      { text: 'One special character (!@#$%^&*)', met: criteria.hasSymbol }
    ];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear errors for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Update password strength
    if (name === 'password') {
      const result = checkPasswordStrength(value);
      setPasswordStrength(result.strength);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const { criteria } = checkPasswordStrength(formData.password);
      if (!criteria.length) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!criteria.hasUpper) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!criteria.hasLower) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!criteria.hasNumber) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!criteria.hasSymbol) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await axios.post('/api/users', submitData);
      console.log("Account created:", response.data);
      navigate('/login');
    } catch (error) {
      console.error("Error creating account:", error.response?.data || error.message);
      setErrors({ submit: 'Failed to create account. Please try again.' });
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Very Weak';
    if (passwordStrength === 2) return 'Weak';
    if (passwordStrength === 3) return 'Fair';
    if (passwordStrength === 4) return 'Good';
    if (passwordStrength === 5) return 'Strong';
    return 'Very Weak';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return '#ff4757';
    if (passwordStrength === 1) return '#ff4757';
    if (passwordStrength === 2) return '#ff6b6b';
    if (passwordStrength === 3) return '#ffa502';
    if (passwordStrength === 4) return '#2ed573';
    if (passwordStrength === 5) return '#1dd1a1';
    return '#ff4757';
  };

  return (
    <div className="signup-container">
      <div className="signup-image">
        <img src={signupImage} alt="Join Road2Skill" />
        <div className="signup-image-overlay"></div>
        <div className="signup-image-content">
          <h1>Start Your Learning Journey</h1>
          <p>Join thousands of learners advancing their skills</p>
        </div>
      </div>
      <div className="signup-form">
        <div className="signup-box">
          <h2>Create Your Account</h2>
          <p>Join Road2Skill and unlock your potential</p>
          
          {errors.submit && (
            <div className="error-message global-error">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
                required
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.password && (
                <div className="password-validation">
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: `${(passwordStrength / 5) * 100}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      ></div>
                    </div>
                    <span style={{ color: getPasswordStrengthColor() }}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="password-requirements">
                    {getPasswordRequirements()?.map((req, index) => (
                      <div key={index} className={`requirement ${req.met ? 'met' : 'unmet'}`}>
                        <span className="requirement-icon">
                          {req.met ? '✓' : '✗'}
                        </span>
                        <span className="requirement-text">{req.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="input-group">
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="signup-btn">
              CREATE ACCOUNT
            </button>
          </form>

          <div className="signup-footer">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountForm;
