import React, { useState } from 'react';
import '../componentsCss/Login.css';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle login logic here
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="/Users/mdehteshamansari00/Road2Skill/Frontend/Road2Skill/src/assets/LoginImg.jpg"  />
        <div className="login-image-overlay"></div>
      </div>
      <div className="login-form">
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
          <p>New on our platform? <a href="#">Create an account</a></p>
          <div className="social-login">
            {/* <span>or</span> */}
            <div className="social-icons">
              {/* Add social media icons here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
