import React, { useState, useEffect } from "react";
import "../Styles/DeckCentre.css";
import ElixerIcon from "../Assets/ElixerIcon.png";
import ATK from "../Assets/ATK.svg";
import DEF from "../Assets/DEF.svg";
import F2P from "../Assets/F2P.svg";

// Deck card IDs for your deck
const DECK_CARD_IDS = [100, 45, 52, 83, 33, 104, 93, 84];

const DECK_PAGES = [
  { key: "builder", label: "Builder" },
  { key: "library", label: "Library" },
  { key: "compare", label: "Compare" },
];

const ASSETS_BASE = process.env.REACT_APP_ASSETS_BASE || 'http://localhost:6969/assets/';

const toCardSrc = (imageUrl) => {
  const clean = String(imageUrl || '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');
  const withFolder = clean.startsWith('Cards/') ? clean : `Cards/${clean}`;
  return `${ASSETS_BASE}${withFolder}`;
};

const DeckCentre = () => {
  const [activePage, setActivePage] = useState("builder");
  const [deckCards, setDeckCards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6969/cards")
      .then((res) => res.json())
      .then((data) => {
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
        const filtered = cardsArray.filter((card) => DECK_CARD_IDS.includes(card.card_id));
        const sorted = DECK_CARD_IDS.map((id) => filtered.find((card) => card.card_id === id)).filter(Boolean);
        setDeckCards(sorted);
      });
  }, []);

  return (
    <div className="deck-centre-header">
      <h1>Deck Centre</h1>
      <div className="deckCentrePages">
        {DECK_PAGES.map((page, idx) => (
          <div
            key={page.key}
            className={`deckCentrePageName${
              activePage === page.key ? " active" : ""
            }`}
            onClick={() => setActivePage(page.key)}
          >
            {page.label}
          </div>
        ))}
      </div>
      <div className="deckCentreUnderlineWrapper">
        <div
          className="deckCentreUnderline"
          style={{
            transform: `translateX(${DECK_PAGES.findIndex(
              (p) => p.key === activePage
            ) * 100}%)`,
          }}
        />
      </div>
      <div className="deckCentreContent">
        {activePage === "builder" &&  (
          <div className="builderDeckContainer">
            <div className="builderDeckMain">
              <div className="builderDeckStats">
                <div className="builderDeckStat">
                  <div className="builderDeckStatIcon">
                    <img src={ElixerIcon} alt="Elixir Icon" />
                  </div>
                  <div className="builderDeckStatContent">3.5</div>
                </div>
                <div className="builderDeckStat">
                  <div className="builderDeckStatIcon">
                    <img src={ATK} alt="ATK Icon" />
                  </div>
                  <div className="builderDeckStatContent">7/10</div>
                </div>
                <div className="builderDeckStat">
                  <div className="builderDeckStatIcon">
                    <img src={DEF} alt="DEF Icon" />
                  </div>
                  <div className="builderDeckStatContent">9/10</div>
                </div>
                <div className="builderDeckStat">
                  <div className="builderDeckStatIcon">
                    <img src={F2P} alt="F2P Icon" />
                  </div>
                  <div className="builderDeckStatContent">9/10</div>
                </div>
              </div>
              <div className="builderDeckCards">
                {deckCards.map((card) => (
                  <div className="builderDeckCard" key={card.card_id}>
                    <img
                      src={toCardSrc(card.image_url)}
                      alt={card.name}
                      className="builderDeckCardImg"
                    />
                  </div>
                ))}
              </div>
              <div className="builderDeckCTA">
                <div className="builderDeckCTAButton">Copy</div>
                <div className="builderDeckCTAButton">Improve</div>
                <div className="builderDeckCTAButton">Compare</div>
              </div>
            </div>
          </div>
        )}

        {activePage === "library" && <div>
          {/* Library page content here */}
          
          </div>}











        {activePage === "compare" && <div>
          {/* Compare page content here */}

          </div>}











      </div>
    </div>
  );
};

export default DeckCentre;