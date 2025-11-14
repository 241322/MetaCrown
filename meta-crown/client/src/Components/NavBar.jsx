import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../Styles/NavBar.css";
import crown from "../Assets/crown.png";

const NavBar = () => {
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial username
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "");
    setIsAdmin(localStorage.getItem("is_admin") === "true");
    
    // Listen for storage changes (when localStorage is updated)
    const handleStorageChange = () => {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername || "");
      setIsAdmin(localStorage.getItem("is_admin") === "true");
    };
    
    // Custom event listener for localStorage changes within same tab
    const handleUserUpdate = () => {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername || "");
      setIsAdmin(localStorage.getItem("is_admin") === "true");
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    localStorage.removeItem("playerTag");
    localStorage.removeItem("userOwnTag");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("token");
    // Add any other user-related localStorage items you might have
    
    // Close dropdown
    setShowDropdown(false);
    
    // Navigate to landing page
    navigate("/");
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/">
          <img src={crown} alt="Crown Logo" className="crown-logo" />
        </Link>
        <ul className="nav-main-links">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>My Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/deck-centre" className={({ isActive }) => isActive ? "active-link" : ""}>Deck Centre</NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? "active-link" : ""}>Leaderboard</NavLink>
          </li>
        </ul>
      </div>
      <ul className="nav-right-links">
        {username ? (
          <>
            <li className="username-dropdown-container" ref={dropdownRef}>
              <div 
                className="username-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {username}
              </div>
              {showDropdown && (
                <div className="username-dropdown">
                  <button 
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </li>
            {isAdmin && (
              <li><NavLink to="/admin" className={({ isActive }) => isActive ? "active-link" : ""}>Admin</NavLink></li>
            )}
          </>
        ) : (
          <li><NavLink to="/splash" className={({ isActive }) => isActive ? "active-link" : ""}>Sign Up</NavLink></li>
        )}
        <li><NavLink to="/help" className={({ isActive }) => isActive ? "active-link" : ""}>Help</NavLink></li>
      </ul>
    </nav>
  );
};

export default NavBar;