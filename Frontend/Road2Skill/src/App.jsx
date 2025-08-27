// App.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { FaMoon, FaSun, FaSearch, FaUser, FaBell } from 'react-icons/fa';
import './App.css';
import './componentsCss/NavBar.css';
import CreateAccountForm from './components/CreateAccountForm';
import Login from './components/Login';
import Home from './components/Home';
import ContributionForm from './components/ContributionForm';
import RoadmapExplore from './components/RoadmapExplore';
import RoadmapLearning from './components/RoadmapLearning';
import UserProfile from './components/UserProfile';
import ResourceHub from './components/ResourceHub';
import CommunityInsights from './components/CommunityInsights';
import CareerGuidance from './components/CareerGuidance';
import MyLearningProgress from './components/MyLearningProgress';
import UserOnboarding from './components/UserOnboarding';
import PersonalizedRecommendations from './components/PersonalizedRecommendations';
import ScrollToTop from './components/ScrollToTop';

// Theme Context
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowOnboarding(false);
    setUserProfile(null);
  };

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  const checkUserProfile = async () => {
    try {
      if (isLoggedIn) {
        // First check auth status which includes onboarding completion
        const authResponse = await fetch('/api/auth/status', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (authResponse.ok) {
          const authData = await authResponse.json();
          console.log('Auth status:', authData);
          
          if (authData.msg === 'success' && authData.onboardingCompleted) {
            // User has completed onboarding, get their profile
            const profileResponse = await fetch('/api/user/profile', {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              setUserProfile(profileData);
              setShowOnboarding(false);
            }
          } else if (authData.msg === 'success' && !authData.onboardingCompleted) {
            // User is logged in but hasn't completed onboarding
            console.log('User needs to complete onboarding');
            setShowOnboarding(true);
          }
        } else {
          console.log('Auth check failed');
          setShowOnboarding(false);
        }
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      setShowOnboarding(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      checkUserProfile();
    }
  }, [isLoggedIn]);

  // ProtectedRoute component to restrict access to certain routes
  const ProtectedRoute = ({ element, isLoggedIn, redirectPath = '/login' }) => {
    if (!isLoggedIn) {
      alert('Please log in first to access the contribution page.');
      return <Navigate to={redirectPath} replace />;
    }
    return element;
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <Router>
        <ScrollToTop />
        <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
          <nav className="modern-navbar">
            <div className="navbar-brand">
              <Link to="/" className="logo">
                <span className="logo-icon">🚀</span>
                <span className="logo-text">Road2Skill</span>
              </Link>
            </div>
            
            <div className="navbar-center">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search roadmaps, resources..." 
                  className="global-search-bar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="navbar-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/roadmaps" className="nav-link">Roadmaps</Link>
              {isLoggedIn && <Link to="/recommendations" className="nav-link">For You</Link>}
              {isLoggedIn && <Link to="/my-progress" className="nav-link">My Progress</Link>}
              <Link to="/resources" className="nav-link">Resources</Link>
              <Link to="/community" className="nav-link">Community</Link>
              <Link to="/career" className="nav-link">Career</Link>
              {isLoggedIn && <Link to="/contribute" className="nav-link">Contribute</Link>}
            </div>
            
            <div className="navbar-actions">
              <button onClick={toggleDarkMode} className="theme-toggle" title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
              
              {!isLoggedIn ? (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-outline">Login</Link>
                  <Link to="/create-account" className="btn btn-primary">Sign Up</Link>
                </div>
              ) : (
                <div className="user-menu">
                  <button className="notification-btn" title="Notifications">
                    <FaBell />
                    <span className="notification-badge">3</span>
                  </button>
                  <Link to="/profile" className="profile-btn" title="Profile">
                    <FaUser />
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                </div>
              )}
            </div>
          </nav>
          
          <main className="main-content">
            {showOnboarding ? (
              <UserOnboarding onComplete={handleOnboardingComplete} />
            ) : (
            <Routes>
              <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
              <Route path="/create-account" element={<CreateAccountForm />} />
              <Route path="/contribute" element={
                <ProtectedRoute 
                  element={<ContributionForm />} 
                  isLoggedIn={isLoggedIn} 
                />
              } />
              <Route path="/roadmaps" element={<RoadmapExplore searchQuery={searchQuery} />} />
              <Route path="/roadmap/:id/learn" element={<RoadmapLearning />} />
              <Route path="/my-progress" element={<MyLearningProgress />} />
              <Route path="/recommendations" element={
                <ProtectedRoute 
                  element={<PersonalizedRecommendations />} 
                  isLoggedIn={isLoggedIn} 
                />
              } />
              <Route path="/resources" element={<ResourceHub searchQuery={searchQuery} />} />
              <Route path="/community" element={<CommunityInsights />} />
              <Route path="/career" element={<CareerGuidance />} />
              <Route path="/profile" element={
                <ProtectedRoute 
                  element={<UserProfile user={user} />} 
                  isLoggedIn={isLoggedIn} 
                />
              } />
            </Routes>
            )}
          </main>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
