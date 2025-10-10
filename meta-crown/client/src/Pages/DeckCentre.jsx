import React, { useState } from "react";
import "../Styles/DeckCentre.css";

const DECK_PAGES = [
  { key: "builder", label: "Builder" },
  { key: "library", label: "Library" },
  { key: "compare", label: "Compare" },
];

const DeckCentre = () => {
  const [activePage, setActivePage] = useState("builder");

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
        {activePage === "builder" && null}

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