import React from "react";
import { Link } from "react-router-dom";
import "../Styles/NavBar.css";
const NavBar = () => (
  <nav>
    <ul>
      <li><Link to="/">Dashboard</Link></li>
      <li><Link to="/deck-centre">Deck Centre</Link></li>
      <li><Link to="/leaderboard">Leaderboard</Link></li>
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/settings">Settings</Link></li>
      <li><Link to="/help">Help</Link></li>
    </ul>
  </nav>
);

export default NavBar;