import React, { useEffect, useState, useMemo } from "react";
import { getPlayer, getPlayerBattles, normalizeTag } from "../api/clash";
import "../Styles/Dashboard.css";
import PlayerSearch from "../Assets/PlayerSearch.svg";
import Arena24 from "../Assets/Legendary_Arena.webp";
import Master1 from "../Assets/RankedMaster1.png";
import MergeGold3 from "../Assets/Merge Tactics Gold 3.svg";
import ElixerIcon from "../Assets/ElixerIcon.png";
import ATK from "../Assets/ATK.svg";
import DEF from "../Assets/DEF.svg";
import F2P from "../Assets/F2P.svg";
import RewindRecord from "../Components/RewindRecord";

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
  const [clanName, setClanName] = useState(""); // New state for clan name
  const [crPlayer, setCrPlayer] = useState(null);
  const [crError, setCrError] = useState(null);
  
  // New state for CR deck and loading
  const [currentDeck, setCurrentDeck] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [deckLoading, setDeckLoading] = useState(true);
  
  // New state for battle history
  const [battleHistory, setBattleHistory] = useState([]);
  const [battlesLoading, setBattlesLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allBattles, setAllBattles] = useState([]);
  const [displayedBattles, setDisplayedBattles] = useState(5);
  
  // New pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [showPagination, setShowPagination] = useState(false);
  const RECORDS_PER_PAGE = 10;

  // New state for alerts
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("loading"); // "loading", "error", "success"

  // Average calculations using current deck from CR API
  const avgElixir = useMemo(() => {
    if (!Array.isArray(currentDeck) || currentDeck.length === 0) return "0.0";
    const total = currentDeck.reduce((sum, card) => sum + (card.elixirCost || 0), 0);
    return (total / currentDeck.length).toFixed(1);
  }, [currentDeck]);

  // Keep existing avgAtk, avgDef, avgF2P (using deckCards fallback for now)
  const [deckCards, setDeckCards] = useState([]);
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

  // Fetch all cards from CR API once
  useEffect(() => {
    fetch('http://localhost:6969/api/cr/cards')
      .then(res => res.json())
      .then(data => {
        setAllCards(data?.items || []);
      })
      .catch(console.error);

    // Keep existing deck cards fetch for ratings
    fetch("http://localhost:6969/cards")
      .then(res => res.json())
      .then(data => {
        let cardsArray = [];
        if (Array.isArray(data)) {
          cardsArray = data;
        } else if (Array.isArray(data.cards)) {
          cardsArray = data.cards;
        } else if (Array.isArray(data.result)) {
          cardsArray = data.result;
        }
        const filtered = cardsArray.filter(card => DECK_CARD_IDS.includes(card.card_id));
        const sorted = DECK_CARD_IDS.map(id => filtered.find(card => card.card_id === id)).filter(Boolean);
        setDeckCards(sorted);
      });

    const storedPlayerTag = localStorage.getItem("playerTag") || "";
    setPlayerTag(storedPlayerTag);
  }, []);

  // Update current deck when player or cards change
  useEffect(() => {
    if (crPlayer?.currentDeck && allCards.length > 0) {
      setDeckLoading(true);
      
      const deckWithImages = crPlayer.currentDeck.map(deckCard => {
        const fullCard = allCards.find(card => card.id === deckCard.id);
        return fullCard ? {
          ...fullCard,
          level: deckCard.level,
          imageUrl: fullCard.iconUrls?.medium || ''
        } : null;
      }).filter(Boolean);
      
      setCurrentDeck(deckWithImages);
      setDeckLoading(false);
    } else if (crPlayer) {
      setDeckLoading(false);
    }
  }, [crPlayer, allCards]);

  // Load initial player data
  useEffect(() => {
    const stored = localStorage.getItem('playerTag') || '#2RC0P82YC';
    const tag = normalizeTag(stored).slice(1);
    if (!tag) return;
    fetchPlayerData(tag);
  }, []);

  // Function to show alert
  const showAlertMessage = (message, type = "loading", duration = 3000) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    if (type !== "loading") {
      setTimeout(() => {
        setShowAlert(false);
      }, duration);
    }
  };

  // Function to hide alert
  const hideAlert = () => {
    setShowAlert(false);
  };

  // Helper function to fetch player and battles
  const fetchPlayerData = async (tagNoHash) => {
    try {
      showAlertMessage("Loading player data...", "loading");
      setDeckLoading(true);
      setBattlesLoading(true);
      
      // Fetch player data and battles in parallel
      const [playerData, battlesData] = await Promise.all([
        getPlayer(tagNoHash),
        getPlayerBattles(tagNoHash)
      ]);
      
      // Debug: Log the first battle to see structure
      if (battlesData && battlesData.length > 0) {
        console.log('First battle structure:', JSON.stringify(battlesData[0], null, 2));
      }
      
      setCrPlayer(playerData);
      setUsername(playerData?.name || "");
      setClanName(playerData?.clan?.name || "No Clan");
      setAllBattles(battlesData || []);
      setBattleHistory((battlesData || []).slice(0, 5));
      setDisplayedBattles(5);
      setCurrentPage(1);
      setShowPagination(false);
      setCrError(null);
      
      // Show success message briefly
      showAlertMessage(`Player "${playerData?.name || tagNoHash}" loaded successfully!`, "success", 2000);
      
    } catch (e) {
      setCrError(e.message);
      setUsername("");
      setClanName("");
      setBattleHistory([]);
      setAllBattles([]);
      setShowPagination(false);
      
      // Show error message
      showAlertMessage("Please enter a valid Player Tag", "error", 4000);
    } finally {
      setDeckLoading(false);
      setBattlesLoading(false);
    }
  };

  // Load more battles (up to 10 total)
  const loadMoreBattles = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const newDisplayCount = displayedBattles + 5;
      setBattleHistory(allBattles.slice(0, newDisplayCount));
      setDisplayedBattles(newDisplayCount);
      
      // If we've reached 10 records, switch to pagination
      if (newDisplayCount >= 10) {
        setShowPagination(true);
      }
      
      setLoadingMore(false);
    }, 500);
  };

  // Handle page change in pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * RECORDS_PER_PAGE;
    const endIndex = startIndex + RECORDS_PER_PAGE;
    setBattleHistory(allBattles.slice(startIndex, endIndex));
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(allBattles.length / RECORDS_PER_PAGE);

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Press Enter to fetch player and update deck + battles
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const norm = normalizeTag(search);
      const tagNoHash = norm.slice(1);
      if (!tagNoHash) {
        showAlertMessage("Please enter a valid Player Tag", "error", 3000);
        return;
      }
      
      setPlayerTag(norm);
      localStorage.setItem("playerTag", norm);
      fetchPlayerData(tagNoHash);
    }
  };

  // Normalize input to "#"+A-Z0-9, max 9 after '#'
  const handleSearchChange = (e) => {
    let value = e.target.value || "";
    if (!value.startsWith("#")) value = "#" + value.replace(/^#+/, "");
    value = "#" + value.slice(1).replace(/[^A-Za-z0-9]/g, "").slice(0, 9);
    setSearch(value);
  };

  // Prepare deck data for RewindRecord component
  const playerDeckData = currentDeck.length > 0 
    ? currentDeck 
    : deckCards.map(card => ({
        ...card,
        src: toCardSrc(card.image_url)
      }));

  // Helper to convert battle data to RewindRecord props
  const formatBattleForRewind = (battle, playerTag) => {
    const team = battle.team || [];
    const opponent = battle.opponent || [];
    
    // Find player in team array
    const playerInTeam = team.find(p => p.tag === playerTag);
    const opponentPlayer = opponent[0] || {};
    
    // Debug logging to see the battle structure
    console.log('Battle data:', battle);
    console.log('Team data:', team);
    console.log('Opponent data:', opponent);
    console.log('Opponent player:', opponentPlayer);
    
    // Map decks with CR card images - limit to 8 cards for 4x2 grid
    const mapDeck = (deckArray) => {
      return (deckArray || []).slice(0, 8).map(deckCard => {
        const fullCard = allCards.find(card => card.id === deckCard.id);
        return fullCard ? {
          ...fullCard,
          imageUrl: fullCard.iconUrls?.medium || ''
        } : null;
      }).filter(Boolean);
    };

    // Try multiple possible trophy fields for opponent
    const getOpponentTrophies = (opponent) => {
      return opponent?.startingTrophies || 
             opponent?.trophies || 
             opponent?.currentTrophies || 
             opponent?.trophy || 
             0;
    };

    return {
      playerUsername: playerInTeam?.name || username,
      playerTrophies: playerInTeam?.startingTrophies || playerInTeam?.trophies || crPlayer?.trophies || 0,
      playerDeck: mapDeck(playerInTeam?.cards),
      opponentUsername: opponentPlayer?.name || "Unknown",
      opponentTrophies: getOpponentTrophies(opponentPlayer),
      opponentDeck: mapDeck(opponentPlayer?.cards),
      result: battle.team?.[0]?.crowns > battle.opponent?.[0]?.crowns ? "Victory" : "Defeat",
      playerScore: battle.team?.[0]?.crowns || 0,
      opponentScore: battle.opponent?.[0]?.crowns || 0,
      battleTime: battle.battleTime
    };
  };

  return (
    <div className="dashboard-searchbar-wrapper">
      {/* Alert Component */}
      {showAlert && (
        <div className={`alert-overlay ${showAlert ? 'show' : ''}`}>
          <div className={`alert-box ${alertType}`}>
            <div className="alert-content">
              {alertType === "loading" && (
                <div className="alert-spinner"></div>
              )}
              <span className="alert-message">{alertMessage}</span>
              {alertType !== "loading" && (
                <button 
                  className="alert-close"
                  onClick={hideAlert}
                  aria-label="Close alert"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="dashboard-searchbar">
        <img src={PlayerSearch} alt="Search Icon" className="search-icon" />
        <input
          type="text"
          className="search-input"
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search user tag"
          maxLength={10}
        />
      </div>

      <div className="dashboardHeader">
        <div className="dashboard-user-info">
          <div className="dashboard-username">{username}</div>
          <div className="dashboard-clan-name">{clanName}</div> {/* Changed from playerTag to clanName */}
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
            <div className="dashboardDeckStat">
              <div className="dashboardDeckStatIcon"><img src={ElixerIcon} alt="Elixir Icon" /></div>
              <div className="dashboardDeckStatContent">{avgElixir}</div>
            </div>
            <div className="dashboardDeckStat">
              <div className="dashboardDeckStatIcon"><img src={ATK} alt="ATK Icon" /></div>
              <div className="dashboardDeckStatContent">{avgAtk}/10</div>
            </div>
            <div className="dashboardDeckStat">
              <div className="dashboardDeckStatIcon"><img src={DEF} alt="DEF Icon" /></div>
              <div className="dashboardDeckStatContent">{avgDef}/10</div>
            </div>
            <div className="dashboardDeckStat">
              <div className="dashboardDeckStatIcon"><img src={F2P} alt="F2P Icon" /></div>
              <div className="dashboardDeckStatContent">{avgF2P}/10</div>
            </div>
          </div>
          
          <div className="dashboardDeckCards">
            {deckLoading ? (
              // Loading spinner
              <div className="deck-loading-spinner">
                <div className="spinner"></div>
                <span>Loading deck...</span>
              </div>
            ) : currentDeck.length > 0 ? (
              // Current deck from CR API
              currentDeck.map((card, index) => (
                <div className="dashboardDeckCard" key={card.id || index}>
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="dashboardDeckCardImg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))
            ) : (
              // Fallback to local deck if no current deck
              deckCards.map((card) => (
                <div className="dashboardDeckCard" key={card.card_id}>
                  <img
                    src={toCardSrc(card.image_url)}
                    alt={card.name}
                    className="dashboardDeckCardImg"
                  />
                </div>
              ))
            )}
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
          {battlesLoading ? (
            <div className="battles-loading-spinner">
              <div className="spinner"></div>
              <span>Loading match history...</span>
            </div>
          ) : battleHistory.length > 0 ? (
            <>
              {battleHistory.map((battle, index) => {
                const formattedBattle = formatBattleForRewind(battle, `#${normalizeTag(playerTag).slice(1)}`);
                return (
                  <RewindRecord
                    key={battle.battleTime || index}
                    {...formattedBattle}
                  />
                );
              })}
              
              {/* Show Load More button until 10 records, then show pagination */}
              {!showPagination && displayedBattles < allBattles.length && displayedBattles < 10 && (
                <div className="load-more-container">
                  <button 
                    className="load-more-button"
                    onClick={loadMoreBattles}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <div className="load-more-spinner"></div>
                        Loading...
                      </>
                    ) : (
                      `Load More (${Math.min(5, Math.min(10 - displayedBattles, allBattles.length - displayedBattles))} more)`
                    )}
                  </button>
                </div>
              )}

              {/* Pagination - show when we have 10+ records */}
              {showPagination && totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination">
                    {/* Previous button */}
                    <button 
                      className="pagination-btn pagination-prev"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>

                    {/* Page numbers */}
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                      ) : (
                        <button
                          key={page}
                          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      )
                    ))}

                    {/* Next button */}
                    <button 
                      className="pagination-btn pagination-next"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      ›
                    </button>
                  </div>
                  
                  <div className="pagination-info">
                    Showing {((currentPage - 1) * RECORDS_PER_PAGE) + 1}-{Math.min(currentPage * RECORDS_PER_PAGE, allBattles.length)} of {allBattles.length} battles
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-battles-message">
              <p>No recent battles found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;