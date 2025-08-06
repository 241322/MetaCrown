import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../Styles/NavBar.css";
import crown from "../Assets/crown.png";

const NavBar = () => (
  <nav>
    <div className="nav-left">
      <Link to="/"><img src={crown} alt="Crown Logo" className="crown-logo" /></Link>
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
      <li><NavLink to="/profile" className={({ isActive }) => isActive ? "active-link" : ""}>Profile</NavLink></li>
      <li><NavLink to="/settings" className={({ isActive }) => isActive ? "active-link" : ""}>Settings</NavLink></li>
      <li><NavLink to="/help" className={({ isActive }) => isActive ? "active-link" : ""}>Help</NavLink></li>
    </ul>
  </nav>
);

export default NavBar;