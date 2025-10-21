import React from "react";
import "../Styles/RewindRecord.css";
import VSswords from "../Assets/vsSwords.png";
import TrophyIcon from "../Assets/trophy.png";

const RewindRecord = ({ 
  playerUsername, 
  playerTrophies, 
  playerDeck, 
  opponentUsername, 
  opponentTrophies, 
  opponentDeck,
  result = "Victory",
  playerScore = 3,
  opponentScore = 1 
}) => {
  const isVictory = result === "Victory";
  
  // Ensure only 8 cards maximum for 4x2 grid
  const limitedPlayerDeck = (playerDeck || []).slice(0, 8);
  const limitedOpponentDeck = (opponentDeck || []).slice(0, 8);
  
  return (
    <div className={`matchHistoryRecord ${isVictory ? 'victory' : 'defeat'}`}>
      <div className="metaRewindYou">
        <div className="rewindPlayerHeader">
          <div className="rewindPlayerUsername">{playerUsername}</div>
          <div className="rewindPlayerTrophies">
            <img src={TrophyIcon} alt="Trophy Icon" /> {playerTrophies}
          </div>
        </div>
        <div className="rewindPlayerDeck">
          {limitedPlayerDeck.map((card, index) => (
            <div className="dashboardDeckCard" key={card.id || card.card_id || index}>
              <img
                src={card.imageUrl || card.src}
                alt={card.name}
                className="dashboardDeckCardImg"
              />
            </div>
          ))}
        </div>
      </div>
      <div className={`metaRewindVs ${isVictory ? 'victory' : 'defeat'}`}>
        {result}
        <div className="metaRewindVsIcon">
          <strong className={isVictory ? 'victory' : 'defeat'}>{playerScore}</strong> 
          <img src={VSswords} alt="VS Icon" /> 
          {opponentScore}
        </div>
      </div>
      <div className="metaRewindOpponent">
        <div className="rewindPlayerHeader">
          <div className="rewindPlayerUsername">{opponentUsername}</div>
          <div className="rewindPlayerTrophies">
            <img src={TrophyIcon} alt="Trophy Icon" /> {opponentTrophies}
          </div>
        </div>
        <div className="rewindPlayerDeck">
          {limitedOpponentDeck.map((card, index) => (
            <div className="dashboardDeckCard" key={card.id || card.card_id || index}>
              <img
                src={card.imageUrl || card.src}
                alt={card.name}
                className="dashboardDeckCardImg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewindRecord;