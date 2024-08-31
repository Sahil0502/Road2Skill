import React, { useState } from 'react';
import '../componentsCss/Login.css'; // Make sure the CSS file path is correct
import loginPic from '../assets/LoginImg.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    try {
      const response = await axios.post('/api/auth/login', formData);
      console.log('Login successful:', response.data);
      // Handle successful login, e.g., redirect or store token
    } catch (error) {
      console.error('Error logging in:', error.response.data);
      // Handle login error, e.g., show error message
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={loginPic} alt="Login" />
        <div className="login-image-overlay"></div>
      </div>
      <div className="login-form">
        <div className="login-box">
          <h2>Welcome to Road2Skill!</h2>
          <p>Please sign-in to your account and start the adventure</p>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit">SIGN IN</button>
          </form>
          <div className="login-footer">
            <p>New on our platform? <Link to="/create-account">Create an account</Link></p>
            <div className="social-login">
              {/* Add social media icons here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
