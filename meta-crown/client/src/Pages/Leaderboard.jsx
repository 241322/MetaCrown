import React, { useState, useEffect } from "react";
import "../Styles/Leaderboard.css";

const leaderboardTypes = [
  { key: "players", label: "Players", endpoint: "/api/cr/leaderboards/players" },
  { key: "clans", label: "Clans", endpoint: "/api/cr/leaderboards/clans" }
];

export default function Leaderboard() {
  const [activeLeaderboard, setActiveLeaderboard] = useState("players");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const currentType = leaderboardTypes.find(type => type.key === activeLeaderboard);
        const response = await fetch(`http://localhost:6969${currentType.endpoint}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${activeLeaderboard} leaderboard`);
        }
        
        const data = await response.json();
        // Take only top 30 entries
        setLeaderboardData(data?.items?.slice(0, 30) || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setError(`Failed to load ${activeLeaderboard} leaderboard. Please try again.`);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [activeLeaderboard]);

  const handleLeaderboardChange = (leaderboardKey) => {
    setActiveLeaderboard(leaderboardKey);
  };

  const getDisplayValue = (item, rank) => {
    if (activeLeaderboard === "players") {
      return {
        name: item.name,
        value: item.trophies?.toLocaleString() || "0",
        valueLabel: "Trophies",
        tag: item.tag
      };
    } else if (activeLeaderboard === "clans") {
      return {
        name: item.name,
        value: item.clanScore?.toLocaleString() || "0",
        valueLabel: "Trophies",
        tag: item.tag
      };
    }
    return { name: item.name || "Unknown", value: "0", valueLabel: "", tag: "" };
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "#FFD700"; // Gold
    if (rank === 2) return "#C0C0C0"; // Silver
    if (rank === 3) return "#CD7F32"; // Bronze
    return "#ffffff"; // White for others
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "👑";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <h1 className="leaderboard-title">Global Leaderboards</h1>
        
        {/* Leaderboard Type Selector */}
        <div className="leaderboard-selector">
          {leaderboardTypes.map((type) => (
            <button
              key={type.key}
              className={`leaderboard-tab ${activeLeaderboard === type.key ? 'active' : ''}`}
              onClick={() => handleLeaderboardChange(type.key)}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="leaderboard-loading">
            <div className="spinner"></div>
            <span>Loading {activeLeaderboard} leaderboard...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="leaderboard-error">
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => setActiveLeaderboard(activeLeaderboard)}
            >
              Retry
            </button>
          </div>
        )}

        {/* Leaderboard Content */}
        {!loading && !error && (
          <div className="leaderboard-content">
            <div className="leaderboard-header">
              <span className="header-rank">Rank</span>
              <span className="header-name">Name</span>
              <span className="header-value">Trophies</span>
            </div>
            
            <div className="leaderboard-list">
              {leaderboardData.map((item, index) => {
                const rank = index + 1;
                const displayData = getDisplayValue(item, rank);
                
                return (
                  <div key={item.tag || index} className="leaderboard-item">
                    <div className="item-rank">
                      <span 
                        className="rank-number"
                        style={{ color: getRankColor(rank) }}
                      >
                        {getRankIcon(rank)}
                      </span>
                    </div>
                    
                    <div className="item-name">
                      <span className="player-name">{displayData.name}</span>
                      <span className="player-tag">{displayData.tag}</span>
                    </div>
                    
                    <div className="item-value">
                      <span className="value-number">{displayData.value}</span>
                      <span className="value-label">{displayData.valueLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}