import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import './componentsCss/NavBar.css';
import CreateAccountForm from './components/CreateAccountForm';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/create-account">Sign Up</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccountForm />} />
      </Routes>
    </Router>
  );
}

export default App;
