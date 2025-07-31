import React from "react";
import { Link } from "react-router-dom";
import "../Styles/NavBar.css";
import crown from "../Assets/crown.png";

const NavBar = () => (
  <nav>
    <div className="nav-left">
      <Link to="/"><img src={crown} alt="Crown Logo" className="crown-logo" /></Link>
      <ul className="nav-main-links">
        <li><Link to="/dashboard">My Dashboard</Link></li>
        <li><Link to="/deck-centre">Deck Centre</Link></li>
        <li><Link to="/leaderboard">Leaderboard</Link></li>
      </ul>
    </div>
    <ul className="nav-right-links">
      <li style={{ fontSize: "14px" }}><Link to="/profile">Profile</Link></li>
      <li style={{ fontSize: "14px" }}><Link to="/settings">Settings</Link></li>
      <li style={{ fontSize: "14px" }}><Link to="/help">Help</Link></li>
    </ul>
  </nav>
);

export default NavBar;