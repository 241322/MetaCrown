import React, { useState, useEffect } from "react";
import "../Styles/Dashboard.css";
import PlayerSearch from "../Assets/PlayerSearch.svg";
import Arena24 from "../Assets/Legendary_Arena.webp";
import Master1 from "../Assets/RankedMaster1.png";
import MergeGold3 from "../Assets/Merge Tactics Gold 3.svg";
import ElixerIcon from "../Assets/ElixerIcon.png";
import ATK from "../Assets/ATK.svg";
import DEF from "../Assets/DEF.svg";
import F2P from "../Assets/F2P.svg";
import LumberjackEvoCard from "../Assets/Cards/Evolution/LumberjackCardEvolution.webp";
import BarbarianEvoCard from "../Assets/Cards/Evolution/BarbariansCardEvolution.webp";
import WizardCard from "../Assets/Cards/WizardCard.webp";
import ElectroWizardCard from "../Assets/Cards/ElectroWizardCard.webp";
import BalloonCard from "../Assets/Cards/BalloonCard.webp";
import RageCard from "../Assets/Cards/RageCard.webp";
import IceSpiritCard from "../Assets/Cards/IceSpiritCard.webp";
import BatsCard from "../Assets/Cards/BatsCard.webp";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [username, setUsername] = useState("");
  const [playerTag, setPlayerTag] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedPlayerTag = localStorage.getItem("playerTag") || "";
    setUsername(storedUsername);
    setPlayerTag(storedPlayerTag);
    
    // Optional: listen for storage changes (e.g. another tab / late write)
    const handleStorage = (e) => {
      if (e.key === "username") setUsername(e.newValue || "");
      if (e.key === "playerTag") setPlayerTag(e.newValue || "");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
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
      <div className="dashboardHeader">
      <div className="dashboard-user-info">
        <div className="dashboard-username">{username}</div>
        <div className="dashboard-playertag">{playerTag}</div>
      </div>
      <div className="bigComponents">
        <div className="bigComponent">
          <div className="componentLabel">Throphies</div> 
            <div className="componentAsset">9736</div>
          </div>
        
        <div className="bigComponent">
          <div className="componentLabel">Legendary Arena</div> 
            <div className="componentAsset"><img src={Arena24} alt="Arena" /></div>
        </div>
        
        <div className="bigComponent">
          <div className="componentLabel">Master 1</div> 
          <div className="componentAsset"><img src={Master1} alt="Master 1" /></div>
        </div>
        
        <div className="bigComponent">
          <div className="componentLabel">Merge Tactics</div> 
          <div className="componentAsset"><img src={MergeGold3} alt="Merge Tactics" /></div>
        </div>
      </div>
      <div className="smallComponents">
        <div className="smallComponent">
          <div className="smallComponentLabel">Battles Won</div>
          <div className="smallComponentStat">7000</div>
        </div>
        <div className="smallComponent">
          <div className="smallComponentLabel">Three Crown Wins</div>
          <div className="smallComponentStat">5842</div>
        </div>
        <div className="smallComponent">
          <div className="smallComponentLabel">Highest Trophies</div>
          <div className="smallComponentStat">9971</div>
        </div>
        <div className="smallComponent">
          <div className="smallComponentLabel">Cards Found</div>
          <div className="smallComponentStat">120/121</div>
        </div>
        <div className="smallComponent">
          <div className="smallComponentLabel">Total Donations</div>
          <div className="smallComponentStat">26309</div>
        </div>
        <div className="smallComponent">
          <div className="smallComponentLabel">Favourite Card</div>
          <div className="smallComponentStat">Balloon</div>
        </div>
      </div>
      </div>
      <div className="currentDeckDashboard">
        <h4>Current Deck</h4>
        <div className="dashboardDeckMain">
          <div className="dashboardDeckStats">
            <div className="dashboardDeckStat"><div className="dashboardDeckStatIcon"><img src={ElixerIcon} alt="Elixir Icon" /></div>
            <div className="dashboardDeckStatContent">3.5</div></div>
            <div className="dashboardDeckStat"><div className="dashboardDeckStatIcon"><img src={ATK} alt="ATK Icon" /></div>
            <div className="dashboardDeckStatContent">7/10</div></div>
            <div className="dashboardDeckStat"><div className="dashboardDeckStatIcon"><img src={DEF} alt="DEF Icon" /></div>
            <div className="dashboardDeckStatContent">9/10</div></div>
            <div className="dashboardDeckStat"><div className="dashboardDeckStatIcon"><img src={F2P} alt="F2P Icon" /></div>
            <div className="dashboardDeckStatContent">9/10</div></div>
          </div>
          <div className="dashboardDeckCards">
            <div className="dashboardDeckCard1" id="1"></div>
            <div className="dashboardDeckCard2" id="2"></div>
            <div className="dashboardDeckCard3" id="3"></div>
            <div className="dashboardDeckCard4" id="4"></div>
            <div className="dashboardDeckCard5" id="5"></div>
            <div className="dashboardDeckCard6" id="6"></div>
            <div className="dashboardDeckCard7" id="7"></div>
            <div className="dashboardDeckCard8" id="8"></div>
          </div>
          <div className="dashboardDeckCTA">
            <div className="dashboardDeckCTAButton">Copy</div>
            <div className="dashboardDeckCTAButton">Improve</div>
            <div className="dashboardDeckCTAButton">Compare</div>
          </div>
        </div>
      </div>

      <div className="matchHistoryContainer">
        <h4>Meta Rewind</h4>
      <div className="matchHistoryRecords">
        <div className="matchHistoryRecord"></div>
        <div className="matchHistoryRecord"></div>
        <div className="matchHistoryRecord"></div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;