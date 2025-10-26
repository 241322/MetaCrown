import React, { useState, useEffect, useMemo } from "react";
import "../Styles/DeckCentre.css";
import DeckComponent from "../Components/DeckComponent";
import ElixerIcon from "../Assets/ElixerIcon.png";
import ATK from "../Assets/ATK.svg";
import DEF from "../Assets/DEF.svg";
import F2P from "../Assets/F2P.svg";

const DeckCentre = () => {
  const [activeTab, setActiveTab] = useState("Builder");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [allCards, setAllCards] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(Array(8).fill(null));
  const [cardsLoading, setCardsLoading] = useState(true);
  const [deckName, setDeckName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [savedDecks, setSavedDecks] = useState([]);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState(null); // Track which deck is being edited
  
  // Sorting state
  const [sortType, setSortType] = useState("Alphabetical"); // "Alphabetical", "By Elixir", "By Rarity"
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" (up arrow) or "desc" (down arrow)

  // Fetch all cards from Clash Royale API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setCardsLoading(true);
        const response = await fetch('http://localhost:6969/api/cr/cards');
        const data = await response.json();
        setAllCards(data?.items || []);
      } catch (error) {
        console.error('Failed to fetch cards:', error);
      } finally {
        setCardsLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Fetch user's saved decks
  useEffect(() => {
    const fetchUserDecks = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;

      try {
        setLoadingDecks(true);
        console.log('Fetching decks for user ID:', userId);
        const response = await fetch(`http://localhost:6969/api/decks/user/${userId}`);
        if (response.ok) {
          const decks = await response.json();
          console.log('Fetched decks:', decks);
          console.log('First deck cards:', decks[0]?.cards);
          
          // Log each card's structure
          if (decks[0]?.cards && Array.isArray(decks[0].cards)) {
            decks[0].cards.forEach((card, i) => {
              console.log(`Card ${i}:`, {
                id: card.id,
                name: card.name,
                imageUrl: card.imageUrl,
                iconUrls: card.iconUrls
              });
            });
          } else if (decks[0]?.cards) {
            console.log('Cards is not an array, type:', typeof decks[0].cards);
            console.log('Cards value:', decks[0].cards);
            
            // Try to parse if it's a JSON string
            try {
              const parsedCards = JSON.parse(decks[0].cards);
              console.log('Parsed cards:', parsedCards);
              if (Array.isArray(parsedCards)) {
                parsedCards.forEach((card, i) => {
                  console.log(`Parsed Card ${i}:`, {
                    id: card.id,
                    name: card.name,
                    imageUrl: card.imageUrl,
                    iconUrls: card.iconUrls
                  });
                });
              }
            } catch (e) {
              console.log('Failed to parse cards as JSON:', e);
            }
          }
          
          setSavedDecks(decks);
        } else {
          console.error('Failed to fetch decks:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch user decks:', error);
      } finally {
        setLoadingDecks(false);
      }
    };

    if (activeTab === "Library") {
      fetchUserDecks();
    }
  }, [activeTab]);

  // Get cards that are currently in the deck
  const cardsInDeck = selectedDeck.filter(card => card !== null).map(card => card.id);
  
  // Sorting functions
  const sortCards = (cards, type, direction) => {
    const sortedCards = [...cards];
    
    switch (type) {
      case "Alphabetical":
        sortedCards.sort((a, b) => {
          const comparison = a.name.localeCompare(b.name);
          return direction === "asc" ? comparison : -comparison;
        });
        break;
        
      case "By Elixir":
        sortedCards.sort((a, b) => {
          // Try different possible property names for elixir cost
          const elixirA = a.elixirCost || a.elixir || a.cost || 0;
          const elixirB = b.elixirCost || b.elixir || b.cost || 0;
          const comparison = elixirA - elixirB;
          return direction === "asc" ? comparison : -comparison;
        });
        break;
        
      case "By Rarity":
        const rarityOrder = {
          "common": 1,
          "rare": 2, 
          "epic": 3,
          "legendary": 4,
          "champion": 5,
          // Also handle capitalized versions
          "Common": 1,
          "Rare": 2, 
          "Epic": 3,
          "Legendary": 4,
          "Champion": 5
        };
        sortedCards.sort((a, b) => {
          // Access rarity.name from Clash Royale API structure
          const rarityA = rarityOrder[a.rarity?.name] || rarityOrder[a.rarity] || rarityOrder[a.rarityName] || 0;
          const rarityB = rarityOrder[b.rarity?.name] || rarityOrder[b.rarity] || rarityOrder[b.rarityName] || 0;
          const comparison = rarityA - rarityB;
          return direction === "asc" ? comparison : -comparison;
        });
        break;
        
      default:
        break;
    }
    
    return sortedCards;
  };
  
  // Sort the available cards based on current sort settings
  const filteredCards = allCards.filter(card => !cardsInDeck.includes(card.id));
  const availableCards = sortCards(filteredCards, sortType, sortDirection);
  
  // Handle sort type cycling
  const handleSortTypeClick = () => {
    const sortTypes = ["Alphabetical", "By Elixir", "By Rarity"];
    const currentIndex = sortTypes.indexOf(sortType);
    const nextIndex = (currentIndex + 1) % sortTypes.length;
    setSortType(sortTypes[nextIndex]);
  };
  
  // Handle sort direction toggle
  const handleSortDirectionClick = (direction) => {
    setSortDirection(direction);
  };

  // Deck statistics calculations
  const currentDeck = selectedDeck.filter(card => card !== null);

  const avgElixir = useMemo(() => {
    if (!Array.isArray(currentDeck) || currentDeck.length === 0) return "0.0";
    const total = currentDeck.reduce((sum, card) => sum + (card.elixirCost || card.elixir || card.cost || 0), 0);
    return (total / currentDeck.length).toFixed(1);
  }, [currentDeck]);

  const avgAtk = useMemo(() => {
    if (!Array.isArray(currentDeck) || currentDeck.length === 0) return 0;
    const total = currentDeck.reduce((s, c) => {
      const rating = 5; // Default rating - replace with actual mapping
      return s + rating;
    }, 0);
    const rounded = Math.round(total / currentDeck.length);
    return Math.max(0, Math.min(10, rounded));
  }, [currentDeck]);

  const avgDef = useMemo(() => {
    if (!Array.isArray(currentDeck) || currentDeck.length === 0) return 0;
    const total = currentDeck.reduce((s, c) => {
      const rating = 5; // Default rating - replace with actual mapping
      return s + rating;
    }, 0);
    const rounded = Math.round(total / currentDeck.length);
    return Math.max(0, Math.min(10, rounded));
  }, [currentDeck]);

  const avgF2P = useMemo(() => {
    if (!Array.isArray(currentDeck) || currentDeck.length === 0) return 0;
    const total = currentDeck.reduce((s, c) => {
      const rating = 5; // Default rating - replace with actual mapping
      return s + rating;
    }, 0);
    const rounded = Math.round(total / currentDeck.length);
    return Math.max(0, Math.min(10, rounded));
  }, [currentDeck]);

  // Handle tab transitions with fade effect
  const handleTabClick = (tabName) => {
    if (tabName === activeTab) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveTab(tabName);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 10);
    }, 150);
  };

  // Drag and drop handlers
  const handleDragStart = (e, card) => {
    e.dataTransfer.setData('application/json', JSON.stringify(card));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    try {
      const cardData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (cardsInDeck.includes(cardData.id)) {
        return;
      }
      const newDeck = [...selectedDeck];
      newDeck[slotIndex] = {
        ...cardData,
        imageUrl: cardData.iconUrls?.medium || ''
      };
      setSelectedDeck(newDeck);
    } catch (error) {
      console.error('Error dropping card:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleRemoveCard = (slotIndex) => {
    const newDeck = [...selectedDeck];
    newDeck[slotIndex] = null;
    setSelectedDeck(newDeck);
  };

  const toCardSrc = (imageUrl) => {
    const clean = String(imageUrl || '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');
    const withFolder = clean.startsWith('Cards/') ? clean : `Cards/${clean}`;
    return `${process.env.REACT_APP_ASSETS_BASE || 'http://localhost:6969/assets/'}${withFolder}`;
  };

  // Save deck function
  const handleSaveDeck = async () => {
    const userId = localStorage.getItem('user_id');
    console.log('Save deck - User ID from localStorage:', userId);
    
    if (!userId) {
      setSaveMessage("Please log in to save decks");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    if (!deckName.trim()) {
      setSaveMessage("Please enter a deck name");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    const completeDeck = selectedDeck.filter(card => card !== null);
    console.log('Save deck - Complete deck:', completeDeck);
    console.log('Save deck - Deck length:', completeDeck.length);
    
    if (completeDeck.length !== 8) {
      setSaveMessage("Please complete your deck (8 cards required)");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    try {
      setIsSaving(true);
      setSaveMessage("");

      const deckData = {
        user_id: parseInt(userId),
        deck_name: deckName.trim(),
        cards: completeDeck,
        avg_elixir: parseFloat(avgElixir),
        avg_attack: avgAtk,
        avg_defense: avgDef,
        avg_f2p: avgF2P
      };

      console.log('Save deck - Sending data:', deckData);
      console.log('Save deck - Editing deck ID:', editingDeckId);

      let response;
      let successMessage;

      if (editingDeckId) {
        // Update existing deck
        response = await fetch(`http://localhost:6969/api/decks/${editingDeckId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deckData),
        });
        successMessage = "Deck updated successfully!";
      } else {
        // Create new deck
        response = await fetch('http://localhost:6969/api/decks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deckData),
        });
        successMessage = "Deck saved successfully!";
      }

      console.log('Save deck - Response status:', response.status);
      const data = await response.json();
      console.log('Save deck - Response data:', data);

      if (response.ok) {
        setSaveMessage(successMessage);
        
        if (editingDeckId) {
          // Update the deck in the saved decks list
          setSavedDecks(prevDecks => 
            prevDecks.map(deck => 
              deck.deck_id === editingDeckId 
                ? { ...deck, deck_name: deckName.trim(), cards: completeDeck, avg_elixir: parseFloat(avgElixir), avg_attack: avgAtk, avg_defense: avgDef, avg_f2p: avgF2P }
                : deck
            )
          );
          // Clear editing state
          setEditingDeckId(null);
        } else {
          // Add new deck to the list if we're in library view
          if (activeTab === "Library") {
            // Refresh the library to show the new deck
            setTimeout(() => {
              const fetchUserDecks = async () => {
                try {
                  setLoadingDecks(true);
                  const response = await fetch(`http://localhost:6969/api/decks/user/${userId}`);
                  if (response.ok) {
                    const decks = await response.json();
                    setSavedDecks(decks);
                  }
                } catch (error) {
                  console.error('Failed to refresh decks:', error);
                } finally {
                  setLoadingDecks(false);
                }
              };
              fetchUserDecks();
            }, 100);
          }
        }
        
        setDeckName(""); // Clear the deck name
        setSelectedDeck(Array(8).fill(null)); // Clear the deck
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage(data.message || "Failed to save deck");
        setTimeout(() => setSaveMessage(""), 5000);
      }
    } catch (error) {
      console.error('Save deck error:', error);
      setSaveMessage("Failed to save deck. Please try again.");
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Load deck into builder
  const handleLoadDeck = (deck) => {
    let deckCards = [];
    
    if (Array.isArray(deck.cards)) {
      deckCards = deck.cards;
    } else if (typeof deck.cards === 'string') {
      try {
        deckCards = JSON.parse(deck.cards);
      } catch (e) {
        console.error('Failed to parse deck cards JSON for loading:', e);
        deckCards = [];
      }
    }
    
    // Ensure it's an array and add imageUrl if missing
    deckCards = Array.isArray(deckCards) ? deckCards.map(card => ({
      ...card,
      imageUrl: card.imageUrl || card.iconUrls?.medium || ''
    })) : [];
    
    console.log('Loading deck with processed cards:', deckCards);
    console.log('Setting editing deck ID to:', deck.deck_id);
    
    // Create a new array with 8 slots, filling with cards or null
    const loadedDeck = Array(8).fill(null);
    deckCards.forEach((card, index) => {
      if (index < 8) {
        loadedDeck[index] = card;
      }
    });
    
    setSelectedDeck(loadedDeck);
    setDeckName(deck.deck_name);
    setEditingDeckId(deck.deck_id); // Set the editing deck ID
    
    // Force tab change and component update
    setTimeout(() => {
      setActiveTab("Builder");
      setSaveMessage("Deck loaded successfully for editing!");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 100);
  };

  // Delete deck function
  const handleDeleteDeck = async (deckId) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    if (!window.confirm("Are you sure you want to delete this deck? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:6969/api/decks/${deckId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(userId)
        }),
      });

      if (response.ok) {
        // Remove the deck from the local state
        setSavedDecks(prevDecks => prevDecks.filter(deck => deck.deck_id !== deckId));
        setSaveMessage("Deck deleted successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        const data = await response.json();
        setSaveMessage(data.message || "Failed to delete deck");
        setTimeout(() => setSaveMessage(""), 5000);
      }
    } catch (error) {
      console.error('Delete deck error:', error);
      setSaveMessage("Failed to delete deck. Please try again.");
      setTimeout(() => setSaveMessage(""), 5000);
    }
  };

  return (
    <div className="deck-centre-header">
      <div className="deckCentrePages">
        <div className="deckCentrePagesNames">
        <div
          className="deckCentrePageName"
          onClick={() => handleTabClick("Builder")}
        >
          Builder
        </div>
        <div
          className="deckCentrePageName"
          onClick={() => handleTabClick("Library")}
        >
          Library
        </div>
        </div>
        <div className="deckCentreUnderlineWrapper">
          <div
            className="deckCentreUnderline"
            style={{
              transform: `translateX(${
                activeTab === "Builder" ? "0%" : "100%"
              })`,
            }}
          ></div>
        </div>
      </div>

      <div className={`deckCentreContent ${isTransitioning ? 'transitioning' : ''}`}>
        {activeTab === "Builder" && (
          <div className="builder-section tab-content">
            <h2>Deck Builder</h2>
            
            {/* Deck Name Input */}
            <div className="deck-name-container">
              <input
                type="text"
                placeholder="Enter deck name..."
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="deck-name-input"
                maxLength={50}
              />
              {saveMessage && (
                <div className={`save-message ${saveMessage.includes('success') ? 'success' : 'error'}`}>
                  {saveMessage}
                </div>
              )}
            </div>
            
            {/* Deck Main Container */}
            <div className="deckCentreDeckMain">
              {/* Left Stats */}
              <div className="deckCentreDeckStats">
                <div className="deckCentreDeckStat">
                  <div className="deckCentreDeckStatIcon">
                    <img src={ElixerIcon} alt="Elixir Icon" />
                  </div>
                  <div className="deckCentreDeckStatContent">{avgElixir}</div>
                </div>
                <div className="deckCentreDeckStat">
                  <div className="deckCentreDeckStatIcon">
                    <img src={ATK} alt="ATK Icon" />
                  </div>
                  <div className="deckCentreDeckStatContent">{avgAtk}/10</div>
                </div>
                <div className="deckCentreDeckStat">
                  <div className="deckCentreDeckStatIcon">
                    <img src={DEF} alt="DEF Icon" />
                  </div>
                  <div className="deckCentreDeckStatContent">{avgDef}/10</div>
                </div>
                <div className="deckCentreDeckStat">
                  <div className="deckCentreDeckStatIcon">
                    <img src={F2P} alt="F2P Icon" />
                  </div>
                  <div className="deckCentreDeckStatContent">{avgF2P}/10</div>
                </div>
              </div>

              {/* Center Deck */}
              <DeckComponent 
                currentDeck={currentDeck}
                deckCards={[]}
                deckLoading={false}
                toCardSrc={toCardSrc}
                showPlaceholders={false}
                selectedDeck={selectedDeck}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onRemoveCard={handleRemoveCard}
                isDeckBuilder={true}
              />

              {/* Right CTA Buttons */}
              <div className="deckCentreDeckCTA">
                <div className="deckCentreDeckCTAButton">Copy</div>
                <div className="deckCentreDeckCTAButton">Import</div>
                {editingDeckId && (
                  <div 
                    className="deckCentreDeckCTAButton"
                    onClick={() => {
                      setEditingDeckId(null);
                      setDeckName("");
                      setSelectedDeck(Array(8).fill(null));
                      setSaveMessage("Started new deck!");
                      setTimeout(() => setSaveMessage(""), 2000);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    New Deck
                  </div>
                )}
                <div 
                  className={`deckCentreDeckCTAButton ${isSaving ? 'saving' : ''}`}
                  onClick={handleSaveDeck}
                  style={{ 
                    opacity: isSaving ? 0.6 : 1, 
                    cursor: isSaving ? 'not-allowed' : 'pointer' 
                  }}
                >
                  {isSaving ? 'Saving...' : editingDeckId ? 'Update' : 'Save'}
                </div>
              </div>
            </div>

            {/* Card List Sorting Controls */}
            <div className="card-sort-controls">
              <button 
                className="sort-type-button"
                onClick={handleSortTypeClick}
              >
                {sortType}
              </button>
              <div className="sort-direction-buttons">
                <button 
                  className={`sort-direction-button ${sortDirection === 'asc' ? 'active' : ''}`}
                  onClick={() => handleSortDirectionClick('asc')}
                >
                  ↑
                </button>
                <button 
                  className={`sort-direction-button ${sortDirection === 'desc' ? 'active' : ''}`}
                  onClick={() => handleSortDirectionClick('desc')}
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Card List Container */}
            <div className="cardListContainer">
              {cardsLoading ? (
                <div className="cards-loading">
                  <div className="spinner"></div>
                  <span>Loading cards...</span>
                </div>
              ) : (
                availableCards.map((card) => (
                  <div
                    key={card.id}
                    className="draggable-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                  >
                    <img
                      src={card.iconUrls?.medium || ''}
                      alt={card.name}
                      className="card-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="card-name">{card.name}</div>
                    <div className="card-elixir">{card.elixirCost}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "Library" && (
          <div className="library-section tab-content">
            <h2>Saved Decks</h2>
            
            {loadingDecks ? (
              <div className="library-loading">
                <div className="spinner"></div>
                <span>Loading your saved decks...</span>
              </div>
            ) : savedDecks.length === 0 ? (
              <div className="no-decks-message">
                <p>You haven't saved any decks yet.</p>
                <p>Go to the Builder tab to create and save your first deck!</p>
              </div>
            ) : (
              <div className="library-decks-container">
                <div className="library-decks-column">
                  {savedDecks.filter((_, index) => index % 2 === 0).map((deck, index) => {
                    // Ensure deck.cards is an array and add imageUrl if missing
                    let deckCards = [];
                    
                    if (Array.isArray(deck.cards)) {
                      deckCards = deck.cards;
                    } else if (typeof deck.cards === 'string') {
                      try {
                        deckCards = JSON.parse(deck.cards);
                      } catch (e) {
                        console.error('Failed to parse deck cards JSON:', e);
                        deckCards = [];
                      }
                    }
                    
                    // Ensure it's an array and add imageUrl if missing
                    deckCards = Array.isArray(deckCards) ? deckCards.map(card => ({
                      ...card,
                      imageUrl: card.imageUrl || card.iconUrls?.medium || ''
                    })) : [];
                    
                    console.log(`Deck ${deck.deck_name} processed cards:`, deckCards);
                    
                    return (
                      <div key={deck.deck_id} className="library-deck-item">
                      <div className="library-deck-header">
                        <h3 className="library-deck-name">{deck.deck_name}</h3>
                        <div className="library-deck-stats">
                          <span className="deck-stat">
                            <img src={ElixerIcon} alt="Elixir" className="stat-icon" />
                            {deck.avg_elixir}
                          </span>
                          <span className="deck-stat">
                            <img src={ATK} alt="Attack" className="stat-icon" />
                            {deck.avg_attack}/10
                          </span>
                          <span className="deck-stat">
                            <img src={DEF} alt="Defense" className="stat-icon" />
                            {deck.avg_defense}/10
                          </span>
                          <span className="deck-stat">
                            <img src={F2P} alt="F2P" className="stat-icon" />
                            {deck.avg_f2p}/10
                          </span>
                        </div>
                      </div>
                      
                      <DeckComponent 
                        currentDeck={deckCards}
                        deckCards={[]}
                        deckLoading={false}
                        toCardSrc={toCardSrc}
                        showPlaceholders={false}
                        isDeckBuilder={false}
                      />
                      
                      <div className="library-deck-actions">
                        <button 
                          className="deck-action-btn load-btn"
                          onClick={() => handleLoadDeck(deck)}
                        >
                          Edit deck
                        </button>
                        <button 
                          className="deck-action-btn delete-btn"
                          onClick={() => handleDeleteDeck(deck.deck_id)}
                        >
                          Delete
                        </button>
                      </div>
                      
                      <div className="library-deck-date">
                        Saved: {new Date(deck.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    );
                  })}
                </div>
                <div className="library-decks-column">
                  {savedDecks.filter((_, index) => index % 2 === 1).map((deck, index) => {
                    // Ensure deck.cards is an array and add imageUrl if missing
                    let deckCards = [];
                    
                    if (Array.isArray(deck.cards)) {
                      deckCards = deck.cards;
                    } else if (typeof deck.cards === 'string') {
                      try {
                        deckCards = JSON.parse(deck.cards);
                      } catch (e) {
                        console.error('Failed to parse deck cards JSON:', e);
                        deckCards = [];
                      }
                    }
                    
                    // Ensure it's an array and add imageUrl if missing
                    deckCards = Array.isArray(deckCards) ? deckCards.map(card => ({
                      ...card,
                      imageUrl: card.imageUrl || card.iconUrls?.medium || ''
                    })) : [];
                    
                    console.log(`Deck ${deck.deck_name} processed cards:`, deckCards);
                    
                    return (
                      <div key={deck.deck_id} className="library-deck-item">
                      <div className="library-deck-header">
                        <h3 className="library-deck-name">{deck.deck_name}</h3>
                        <div className="library-deck-stats">
                          <span className="deck-stat">
                            <img src={ElixerIcon} alt="Elixir" className="stat-icon" />
                            {deck.avg_elixir}
                          </span>
                          <span className="deck-stat">
                            <img src={ATK} alt="Attack" className="stat-icon" />
                            {deck.avg_attack}/10
                          </span>
                          <span className="deck-stat">
                            <img src={DEF} alt="Defense" className="stat-icon" />
                            {deck.avg_defense}/10
                          </span>
                          <span className="deck-stat">
                            <img src={F2P} alt="F2P" className="stat-icon" />
                            {deck.avg_f2p}/10
                          </span>
                        </div>
                      </div>
                      
                      <DeckComponent 
                        currentDeck={deckCards}
                        deckCards={[]}
                        deckLoading={false}
                        toCardSrc={toCardSrc}
                        showPlaceholders={false}
                        isDeckBuilder={false}
                      />
                      
                      <div className="library-deck-actions">
                        <button 
                          className="deck-action-btn load-btn"
                          onClick={() => handleLoadDeck(deck)}
                        >
                          Edit deck
                        </button>
                        <button 
                          className="deck-action-btn delete-btn"
                          onClick={() => handleDeleteDeck(deck.deck_id)}
                        >
                          Delete
                        </button>
                      </div>
                      
                      <div className="library-deck-date">
                        Saved: {new Date(deck.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckCentre;