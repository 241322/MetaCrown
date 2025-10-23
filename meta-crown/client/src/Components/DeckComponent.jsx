import React from "react";
import "../Styles/DeckComponent.css";

const DeckComponent = ({ 
  currentDeck = [], 
  deckCards = [],   
  deckLoading = false, 
  toCardSrc,
  showPlaceholders = false,
  selectedDeck = [],
  onDrop,
  onDragOver,
  onRemoveCard,
  isDeckBuilder = false
}) => {
  // Render deck builder slots (8 slots with drag/drop)
  const renderDeckBuilderSlots = () => {
    return Array.from({ length: 8 }, (_, index) => {
      const card = selectedDeck[index];
      
      return (
        <div
          key={`slot-${index}`}
          className={`dashboardDeckCard deck-slot ${!card ? 'empty-slot' : ''}`}
          onDrop={(e) => onDrop && onDrop(e, index)}
          onDragOver={onDragOver}
        >
          {card ? (
            <div className="deck-card-container">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="dashboardDeckCardImg"
              />
              <button
                className="remove-card-btn"
                onClick={() => onRemoveCard && onRemoveCard(index)}
                title="Remove card"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="placeholder-div">
              <span className="drop-text">No card</span>
            </div>
          )}
        </div>
      );
    });
  };

  // Create 8 placeholder divs for empty slots
  const renderPlaceholders = () => {
    return Array.from({ length: 8 }, (_, index) => (
      <div className="dashboardDeckCard placeholder-card" key={`placeholder-${index}`}>
        <div className="placeholder-div"></div>
      </div>
    ));
  };

  return (
    <div className="dashboardDeckCards">
      {deckLoading ? (
        // Loading spinner
        <div className="deck-loading-spinner">
          <div className="spinner"></div>
          <span>Loading deck...</span>
        </div>
      ) : isDeckBuilder ? (
        // Deck builder mode with drag/drop slots
        renderDeckBuilderSlots()
      ) : showPlaceholders ? (
        // Show bright pink placeholders
        renderPlaceholders()
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
      ) : deckCards.length > 0 ? (
        // Fallback to local deck if no current deck
        deckCards.map((card) => (
          <div className="dashboardDeckCard" key={card.card_id}>
            <img
              src={toCardSrc ? toCardSrc(card.image_url) : card.image_url}
              alt={card.name}
              className="dashboardDeckCardImg"
            />
          </div>
        ))
      ) : (
        // Default to placeholders when no cards
        renderPlaceholders()
      )}
    </div>
  );
};

export default DeckComponent;