import React, { useState, useEffect } from "react";
import "../Styles/DeckCentre.css";
import DeckComponent from "../Components/DeckComponent";

const DeckCentre = () => {
  const [activeTab, setActiveTab] = useState("Builder");
  const [allCards, setAllCards] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(Array(8).fill(null)); // 8 slots for deck
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

  // Filter out cards that are already in the deck
  const availableCards = allCards.filter(card => !cardsInDeck.includes(card.id));

  // Handle drag start
  const handleDragStart = (e, card) => {
    e.dataTransfer.setData('application/json', JSON.stringify(card));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle drop on deck slot
  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    try {
      const cardData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Check if card is already in deck
      if (cardsInDeck.includes(cardData.id)) {
        return; // Don't allow duplicate cards
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

  // Handle drag over (required for drop to work)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Remove card from deck slot
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

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
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
          >
          </div>
        </div>
      </div>

      <div className="deckCentreContent">
        {activeTab === "Builder" && (
          <div className="builder-section">
          
            
            
            {/* Wrapped DeckComponent for better centering */}
            <div className="deck-component-wrapper">
              <DeckComponent 
                currentDeck={selectedDeck.filter(card => card !== null)}
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
            </div>

            <div className="deck-info">
              <span className="cards-count">
                Available Cards: {availableCards.length}/{allCards.length}
              </span>
              <span className="deck-count">
                Deck: {cardsInDeck.length}/8 cards
              </span>
            </div>

            {/* Card List Container - now shows only available cards */}
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
          <div>Library Content</div>
        )}

        {activeTab === "Compare" && (
          <div>Compare Content</div>
        )}
      </div>
    </div>
  );
};

export default DeckCentre;