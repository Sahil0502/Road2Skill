// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import './componentsCss/NavBar.css';
import CreateAccountForm from './components/CreateAccountForm';
import Login from './components/Login';
import Home from './components/Home';
import ContributionForm from './components/ContributionForm';
import RoadmapDetail from './components/RoadmapDetail';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/contribute">ContributionForm</Link>
        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-button">Log Out</button>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/create-account" element={<CreateAccountForm />} />
        <Route path="/contribute" element={<ContributionForm />} />
        <Route path="/roadmap/:id" element={<RoadmapDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
