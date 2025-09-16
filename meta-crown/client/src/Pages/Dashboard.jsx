import React, { useState, useEffect } from "react";
import "../Styles/Dashboard.css";
import PlayerSearch from "../Assets/PlayerSearch.svg";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [username, setUsername] = useState("");
  const [playerTag, setPlayerTag] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setPlayerTag(localStorage.getItem("playerTag") || "");
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;
    if (focused) {
      if (!value.startsWith("#")) value = "#" + value.replace(/^#+/, "");
      value = "#" + value.slice(1).replace(/[^0-9]/g, "").slice(0, 9);
    }
    setSearch(value);
  };

  const handleFocus = () => {
    setFocused(true);
    if (search === "") setSearch("#");
  };

  const handleBlur = () => {
    setFocused(false);
    if (search === "#") setSearch("");
  };

  return (
    <div className="dashboard-searchbar-wrapper">
      <div className="dashboard-searchbar">
        <img src={PlayerSearch} alt="Search Icon" className="search-icon" />
        <input
          type="text"
          className="search-input"
          value={search}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search user tag"
        />
      </div>
      <div className="dashboard-user-info">
        <div className="dashboard-username">{username}</div>
        <div className="dashboard-playertag">{playerTag}</div>
      </div>
      <div className="bigComponents">
        <div className="bigComponent"><div className="componentLabel">Component 1</div> <div className="componentAsset"></div></div>
        <div className="bigComponent"><div className="componentLabel">Component 2</div> <div className="componentAsset"></div></div>
        <div className="bigComponent"><div className="componentLabel">Component 3</div> <div className="componentAsset"></div></div>
        <div className="bigComponent"><div className="componentLabel">Component 4</div> <div className="componentAsset"></div></div>
      </div>
      {/* ...rest of your dashboard... */}
    </div>
  );
};

export default Dashboard;