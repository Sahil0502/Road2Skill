// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import './componentsCss/NavBar.css';
import CreateAccountForm from './components/CreateAccountForm';
import Login from './components/Login';
import Home from './components/Home';
import ContributionForm from './components/ContributionForm';
import RoadmapDetail from './components/RoadmapDetail'; // Import the new component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="navbar">
        <Link to="/">Home</Link>
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/create-account">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="logout-button">Log Out</button>
        )}
        <Link to="/contribute">ContributionForm</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/create-account" element={<CreateAccountForm />} />
        <Route path="/contribute" element={<ContributionForm />} />
        <Route path="/roadmap/:id" element={<RoadmapDetail />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;
