import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { Search, ChevronLeft, ChevronRight, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { pauseSong } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      navigate(`/search?q=${e.target.value}`);
    } else {
      navigate('/search');
    }
  };

  const handleLogout = () => {
    pauseSong();
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-nav-btns">
        <button onClick={() => navigate(-1)} className="nav-btn"><ChevronLeft /></button>
        <button onClick={() => navigate(1)} className="nav-btn"><ChevronRight /></button>
        
        {location.pathname === '/search' && (
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="What do you want to listen to?" 
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        )}
      </div>

      <div className="nav-profile">
        {user ? (
          <div className="profile-menu-container">
            <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="profile-icon">
                <User size={18} />
              </div>
              <span className="profile-name">{user.name}</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                <button onClick={handleLogout}>Log out</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/signup" className="signup-link">Sign up</Link>
            <Link to="/login" className="login-link">Log in</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
