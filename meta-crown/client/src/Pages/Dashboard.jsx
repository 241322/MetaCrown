import React, { useEffect, useState, useMemo } from "react";
import { getPlayer, normalizeTag } from "../api/clash";
import "../Styles/Dashboard.css";
import PlayerSearch from "../Assets/PlayerSearch.svg";
import Arena24 from "../Assets/Legendary_Arena.webp";
import Master1 from "../Assets/RankedMaster1.png";
import MergeGold3 from "../Assets/Merge Tactics Gold 3.svg";
import ElixerIcon from "../Assets/ElixerIcon.png";
import ATK from "../Assets/ATK.svg";
import DEF from "../Assets/DEF.svg";
import F2P from "../Assets/F2P.svg";
import VSswords from "../Assets/vsSwords.png"
import TrophyIcon from "../Assets/trophy.png"

const DECK_CARD_IDS = [100, 45, 52, 83, 33, 104, 37, 84];

const ASSETS_BASE = process.env.REACT_APP_ASSETS_BASE || 'http://localhost:6969/assets/';

const toCardSrc = (imageUrl) => {
  const clean = String(imageUrl || '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');
  const withFolder = clean.startsWith('Cards/') ? clean : `Cards/${clean}`;
  return `${ASSETS_BASE}${withFolder}`;
};

const Dashboard = () => {
  const [search, setSearch] = useState(localStorage.getItem("playerTag") || "#2RC0P82YC");
  const [focused, setFocused] = useState(false);
  const [username, setUsername] = useState("");
  const [playerTag, setPlayerTag] = useState("");
  const [deckCards, setDeckCards] = useState([]);
  const [crPlayer, setCrPlayer] = useState(null);
  const [crError, setCrError] = useState(null);

  // Average Elixir (kept as is)
  const avgElixir = useMemo(() => {
    if (!Array.isArray(deckCards) || deckCards.length === 0) return "0.0";
    const total = deckCards.reduce((sum, c) => {
      const val = Number(c.elixir_cost ?? c.elixer_cost ?? 0);
      return sum + (Number.isFinite(val) ? val : 0);
    }, 0);
    return (total / deckCards.length).toFixed(1);
  }, [deckCards]);

  // NEW: Average ratings (0–10, integer)
  const avgAtk = useMemo(() => {
    if (!Array.isArray(deckCards) || deckCards.length === 0) return 0;
    const total = deckCards.reduce((s, c) => {
      const v = Number(c.attack_rating);
      return s + (Number.isFinite(v) ? v : 0);
    }, 0);
    const rounded = Math.round(total / deckCards.length);
    return Math.max(0, Math.min(10, rounded));
  }, [deckCards]);

  const avgDef = useMemo(() => {
    if (!Array.isArray(deckCards) || deckCards.length === 0) return 0;
    const total = deckCards.reduce((s, c) => {
      const v = Number(c.defense_rating);
      return s + (Number.isFinite(v) ? v : 0);
    }, 0);
    const rounded = Math.round(total / deckCards.length);
    return Math.max(0, Math.min(10, rounded));
  }, [deckCards]);

  const avgF2P = useMemo(() => {
    if (!Array.isArray(deckCards) || deckCards.length === 0) return 0;
    const total = deckCards.reduce((s, c) => {
      const v = Number(c.f2p_rating);
      return s + (Number.isFinite(v) ? v : 0);
    }, 0);
    const rounded = Math.round(total / deckCards.length);
    return Math.max(0, Math.min(10, rounded));
  }, [deckCards]);

  useEffect(() => {
    fetch("http://localhost:6969/cards")
      .then(res => res.json())
      .then(data => {
        // Try to find the array in the response
        let cardsArray = [];
        if (Array.isArray(data)) {
          cardsArray = data;
        } else if (Array.isArray(data.cards)) {
          cardsArray = data.cards;
        } else if (Array.isArray(data.result)) {
          cardsArray = data.result;
        } else {
          console.error("API response does not contain an array of cards:", data);
          return;
        }
        const filtered = cardsArray.filter(card => DECK_CARD_IDS.includes(card.card_id));
        const sorted = DECK_CARD_IDS.map(id => filtered.find(card => card.card_id === id)).filter(Boolean);
        setDeckCards(sorted);
      });

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

  useEffect(() => {
    const stored = localStorage.getItem('playerTag') || '';
    const tag = normalizeTag(stored).slice(1); // remove "#" for our server param
    if (!tag) return;
    getPlayer(tag)
      .then(setCrPlayer)
      .catch((e) => setCrError(e.message));
  }, []);
  
  // Normalize input to "#"+A-Z0-9, max 9 after '#'
  const handleSearchChange = (e) => {
    let value = e.target.value || "";
    if (!value.startsWith("#")) value = "#" + value.replace(/^#+/, "");
    value = "#" + value.slice(1).replace(/[^A-Za-z0-9]/g, "").slice(0, 9);
    setSearch(value);
  };

  // Press Enter to fetch player and update stats
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const norm = normalizeTag(search);
      const tagNoHash = norm.slice(1);
      if (!tagNoHash) return;
      getPlayer(tagNoHash)
        .then((p) => {
          setCrPlayer(p);
          localStorage.setItem("playerTag", norm);
        })
        .catch(() => {
          // keep previous stats if fetch fails
        });
    }
  };

  // Initial load from stored tag
  useEffect(() => {
    const stored = localStorage.getItem("playerTag") || search || "#2RC0P82YC";
    const norm = normalizeTag(stored);
    const tagNoHash = norm.slice(1);
    if (!tagNoHash) return;
    getPlayer(tagNoHash)
      .then((p) => setCrPlayer(p))
      .catch(() => setCrPlayer(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="dashboard-searchbar-wrapper">
      <div className="dashboard-searchbar">
        <img src={PlayerSearch} alt="Search Icon" className="search-icon" />
        <input
          type="text"
          className="search-input"
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search user tag"
          maxLength={10} // '#' + up to 9 characters
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
            <div className="componentAsset">{crPlayer?.trophies ?? 0}</div>
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
            <div className="smallComponentStat">{crPlayer?.wins ?? 0}</div>
          </div>
          <div className="smallComponent">
            <div className="smallComponentLabel">Three Crown Wins</div>
            <div className="smallComponentStat">{crPlayer?.threeCrownWins ?? 0}</div>
          </div>
          <div className="smallComponent">
            <div className="smallComponentLabel">Highest Trophies</div>
            <div className="smallComponentStat">{crPlayer?.bestTrophies ?? 0}</div>
          </div>
          <div className="smallComponent">
            <div className="smallComponentLabel">Cards Found</div>
            <div className="smallComponentStat">
              {(crPlayer?.cards?.length ?? 0)}/121
            </div>
          </div>
          <div className="smallComponent">
            <div className="smallComponentLabel">Total Donations</div>
            <div className="smallComponentStat">
              {crPlayer?.totalDonations ?? crPlayer?.donations ?? 0}
            </div>
          </div>
          <div className="smallComponent">
            <div className="smallComponentLabel">Favourite Card</div>
            <div className="smallComponentStat">
              {crPlayer?.currentFavouriteCard?.name ?? "—"}
            </div>
          </div>
        </div>
      </div>
      <div className="currentDeckDashboard">
        <h4>Current Deck</h4>
        <div className="dashboardDeckMain">
          <div className="dashboardDeckStats">
            <div className="dashboardDeckStat"><div className="dashboardDeckStatIcon"><img src={ElixerIcon} alt="Elixir Icon" /></div>
            <div className="dashboardDeckStatContent">{avgElixir}</div></div>
            <div className="dashboardDeckStat"><div className="dashboardDeckStatIcon"><img src={ATK} alt="ATK Icon" /></div>
            <div className="dashboardDeckStatContent">{avgAtk}/10</div></div>
            <div className="dashboardDeckStat"><div className="dashboardDeckStatIcon"><img src={DEF} alt="DEF Icon" /></div>
            <div className="dashboardDeckStatContent">{avgDef}/10</div></div>
            <div className="dashboardDeckStat"><div className="dashboardDeckStatIcon"><img src={F2P} alt="F2P Icon" /></div>
            <div className="dashboardDeckStatContent">{avgF2P}/10</div></div>
          </div>
          <div className="dashboardDeckCards">
            {deckCards.map((card) => (
              <div className="dashboardDeckCard" key={card.card_id}>
                <img
                  src={toCardSrc(card.image_url)}
                  alt={card.name}
                  className="dashboardDeckCardImg"
                />
              </div>
            ))}
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
        <div className="matchHistoryRecord">
          <div className="metaRewindYou">
            <div className="rewindPlayerHeader">
              <div className="rewindPlayerUsername">{username}</div><div className="rewindPlayerTrophies"> <img src={TrophyIcon} alt="Trophy Icon" /> 9736 </div>
            </div>
            <div className="rewindPlayerDeck">
              {deckCards.map((card) => (
                <div className="dashboardDeckCard" key={card.card_id}>
                  {/* <img
                    src={toCardSrc(card.image_url)}
                    alt={card.name}
                    className="dashboardDeckCardImg"
                  /> */}
                </div>
              ))}
            </div>
          </div>
          <div className="metaRewindVs">
            Victory
            <div className="metaRewindVsIcon"> <strong>3</strong> <img src={VSswords} alt="VS Icon" /> 1</div>
          </div>
          <div className="metaRewindOpponent">
            <div className="rewindPlayerHeader">
              <div className="rewindPlayerUsername">Boepensvark</div><div className="rewindPlayerTrophies"> <img src={TrophyIcon} alt="Trophy Icon" /> 12000 </div>
            </div>
            <div className="rewindPlayerDeck"></div>
          </div>
        </div>
        <div className="matchHistoryRecord"></div>
        <div className="matchHistoryRecord"></div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;