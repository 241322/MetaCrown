import React, { useState } from "react";
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
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, cardIndex: null });

  // Ensure currentDeck is always an array
  const safeDeck = Array.isArray(currentDeck) ? currentDeck : [];
  const safeSelectedDeck = Array.isArray(selectedDeck) ? selectedDeck : [];
  const safeDeckCards = Array.isArray(deckCards) ? deckCards : [];

  // Handle right-click context menu
  const handleRightClick = (e, cardIndex) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      cardIndex: cardIndex
    });
  };

  // Handle context menu actions
  const handleRemoveFromContext = () => {
    if (onRemoveCard && contextMenu.cardIndex !== null) {
      onRemoveCard(contextMenu.cardIndex);
    }
    setContextMenu({ visible: false, x: 0, y: 0, cardIndex: null });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, cardIndex: null });
  };

  // Close context menu when clicking elsewhere
  React.useEffect(() => {
    const handleClick = () => closeContextMenu();
    if (contextMenu.visible) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu.visible]);
  // Render deck builder slots (8 slots with drag/drop)
  const renderDeckBuilderSlots = () => {
    return Array.from({ length: 8 }, (_, index) => {
      const card = safeSelectedDeck[index];
      
      return (
        <div
          key={`slot-${index}`}
          className={`dashboardDeckCard deck-slot ${!card ? 'empty-slot' : ''}`}
          onDrop={(e) => onDrop && onDrop(e, index)}
          onDragOver={onDragOver}
        >
          {card ? (
            <div 
              className="deck-card-container"
              onContextMenu={(e) => handleRightClick(e, index)}
            >
              <img
                src={card.imageUrl}
                alt={card.name}
                className="dashboardDeckCardImg"
              />
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
    <>
      <div className={`dashboardDeckCards ${isDeckBuilder ? 'deck-builder-mode' : ''}`}>
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
        ) : safeDeck.length > 0 ? (
          // Current deck from CR API
          safeDeck.map((card, index) => {
            const imageUrl = card.imageUrl || card.iconUrls?.medium || '';
            console.log(`Card ${card.name || 'Unknown'} image URL:`, imageUrl);
            
            return (
              <div className="dashboardDeckCard" key={card.id || index}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={card.name || 'Card'}
                    className="dashboardDeckCardImg"
                    onError={(e) => {
                      console.log('Image failed to load:', imageUrl);
                      e.target.style.display = 'none';
                      // Show card name instead
                      e.target.parentElement.innerHTML = `<div class="card-name-fallback">${card.name || 'Card'}</div>`;
                    }}
                  />
                ) : (
                  <div className="card-name-fallback">{card.name || 'Card'}</div>
                )}
              </div>
            );
          })
        ) : safeDeckCards.length > 0 ? (
          // Fallback to local deck if no current deck
          safeDeckCards.map((card) => (
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

      {/* Context Menu */}
      {contextMenu.visible && (
        <div 
          className="context-menu"
          style={{ 
            position: 'fixed', 
            top: contextMenu.y, 
            left: contextMenu.x, 
            zIndex: 1000 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="context-menu-item"
            onClick={handleRemoveFromContext}
          >
            Remove Card
          </button>
        </div>
      )}
    </>
  );
};

export default DeckComponent;