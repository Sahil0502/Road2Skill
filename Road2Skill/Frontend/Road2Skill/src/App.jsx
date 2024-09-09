// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import './componentsCss/NavBar.css';
import CreateAccountForm from './components/CreateAccountForm';
import Login from './components/Login';
import Home from './components/Home';
import ContributionForm from './components/ContributionForm';
import RoadmapDetail from './components/RoadmapDetail';
import RoadmapExplore from './components/RoadmapExplore';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // ProtectedRoute component to restrict access to certain routes
  const ProtectedRoute = ({ element, isLoggedIn, redirectPath = '/login' }) => {
    if (!isLoggedIn) {
      alert('Please log in first to access the contribution page.');
      return <Navigate to={redirectPath} replace />;
    }
    return element;
  };

  return (
    <Router>
      <div className="navbar">
        <h1 className="logo">Road2Skill</h1>
        <Link to="/">Home</Link>
        <Link to="/contribute">ContributionForm</Link>
        {/* <input type="text" placeholder="Search roadmaps..." className="search-bar" /> */}
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="navbar-auth-button">Login</Link>
            <Link to="/create-account" className="navbar-auth-button">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="logout-button">Log Out</button>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/create-account" element={<CreateAccountForm />} />
        <Route path="/contribute" element={
          <ProtectedRoute 
            element={<ContributionForm />} 
            isLoggedIn={isLoggedIn} 
          />
        } />
        <Route path="/roadmap/:id" element={<RoadmapDetail />} />
        <Route path="/roadmaps" element={<RoadmapExplore />} />
      </Routes>
    </Router>
  );
}

export default App;
