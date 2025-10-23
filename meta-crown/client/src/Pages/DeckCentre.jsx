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

  // Get cards that are currently in the deck
  const cardsInDeck = selectedDeck.filter(card => card !== null).map(card => card.id);
  const availableCards = allCards.filter(card => !cardsInDeck.includes(card.id));

  // Deck statistics calculations
  const currentDeck = selectedDeck.filter(card => card !== null);

  const avgElixir = useMemo(() => {
    if (!Array.isArray(currentDeck) || currentDeck.length === 0) return "0.0";
    const total = currentDeck.reduce((sum, card) => sum + (card.elixirCost || 0), 0);
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
        <div
          className="deckCentrePageName"
          onClick={() => handleTabClick("Compare")}
        >
          Compare
        </div>
        </div>
        <div className="deckCentreUnderlineWrapper">
          <div
            className="deckCentreUnderline"
            style={{
              transform: `translateX(${
                activeTab === "Builder" ? "0%" : 
                activeTab === "Library" ? "100%" : "200%"
              })`,
            }}
          ></div>
        </div>
      </div>

      <div className={`deckCentreContent ${isTransitioning ? 'transitioning' : ''}`}>
        {activeTab === "Builder" && (
          <div className="builder-section tab-content">
            <h2>Deck Builder</h2>
            
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
                <div className="deckCentreDeckCTAButton">Compare</div>
                <div className="deckCentreDeckCTAButton">Save</div>
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
            <div className="library-decks-container">
              {/* Left Column */}
              <div className="library-decks-column">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={`left-${index}`} className="library-deck-item">
                    <DeckComponent 
                      currentDeck={[]}
                      deckCards={[]}
                      deckLoading={false}
                      toCardSrc={toCardSrc}
                      showPlaceholders={true}
                      isDeckBuilder={false}
                    />
                    <div className="deleteFromSavedBTN">Delete</div>
                  </div>
                ))}
              </div>
              
              {/* Right Column */}
              <div className="library-decks-column">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={`right-${index}`} className="library-deck-item">
                    <DeckComponent 
                      currentDeck={[]}
                      deckCards={[]}
                      deckLoading={false}
                      toCardSrc={toCardSrc}
                      showPlaceholders={true}
                      isDeckBuilder={false}
                    />
                    <div className="deleteFromSavedBTN">Delete</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Compare" && (
          <div className="compare-section tab-content">
            <div>Compare Content</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckCentre;