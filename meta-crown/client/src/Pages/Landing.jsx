import React, { useState, useEffect } from "react";
import "../Styles/Landing.css";
import crown from "../Assets/crown.png";
import heroKings from "../Assets/heroKings.png";
import welcomeImg from "../Assets/welcomeIMG.jpg";

const sliderItems = [
    "View card stats",
    "Nerf Miner",
    "View Leaderboard",
    "Zap is Love",
    "View my stats",
    "Hog Riiiiiider!",
    "View card stats",
    "Nerf Miner",
    "View Leaderboard",
    "Zap is Love",
    "View my stats",
    "Hog Riiiiiider!",
];

// Popular card names to fetch (commonly used in Clash Royale)
const popularCardNames = ["Knight", "Wizard", "Hog Rider", "Zap"];

const Landing = () => {
    const [topCards, setTopCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopCards = async () => {
            try {
                setLoading(true);
                const API_BASE = 'https://metacrown.co.za';
                const response = await fetch(`${API_BASE}/api/cr/cards`);
                if (!response.ok) throw new Error("Failed to fetch cards");
                
                const data = await response.json();
                
                // Find the popular cards from the full list
                const selectedCards = popularCardNames.map(cardName => 
                    data.items.find(card => card.name === cardName)
                ).filter(card => card !== undefined); // Remove any undefined cards
                
                setTopCards(selectedCards.slice(0, 4)); // Ensure we only have 4 cards
            } catch (error) {
                console.error("Failed to fetch top cards:", error);
                // Set empty array on error, cards will show as empty divs
                setTopCards([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopCards();
    }, []);

    return (
        <div>
            <div className="hero">
                <div className="heroTitle">
                    <img src={crown} alt="Crown Logo" className="crown-logo-landing" />
                    <h2 className="metaTitle">META</h2>
                    <h2 className="crownTitle">CROWN</h2>
                </div>
                <img src={heroKings} alt="Hero Kings" className="hero-kings-img" />
                <div className="heroSlider">
                    <ul>
                        {sliderItems.concat(sliderItems).map((item, idx) => (
                            <li className="sliderContent" key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="topPicks">
                <div className="topPickHeader">
                    <h3 className="topPickTitle">Today's Top Picks</h3>
                    <div className="info-button-container">
                        <div className="info-button">
                            <span className="info-icon">i</span>
                            <div className="info-tooltip">
                                These are the 4 most popular cards currently used by top players worldwide. Updated daily based on global usage statistics from professional matches and leaderboard decks.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="topPickContent">
                    {loading ? (
                        // Show placeholder cards while loading
                        <>
                            <div className="topPickCard"></div>
                            <div className="topPickCard"></div>
                            <div className="topPickCard"></div>
                            <div className="topPickCard"></div>
                        </>
                    ) : (
                        // Show cards with images or empty divs if no cards
                        Array.from({ length: 4 }, (_, index) => {
                            const card = topCards[index];
                            return (
                                <div key={index} className="topPickCard">
                                    {card && card.iconUrls?.medium && (
                                        <img 
                                            src={card.iconUrls.medium} 
                                            alt={card.name}
                                            className="top-pick-card-image"
                                        />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <div className="welcome">
                <h2 className="welcomeHeading">Welcome to Meta Crown</h2>
                <div className="welcomeContent">
                    <div className="welcomeImgWrapper">
                        <img className="welcomeImg" src={welcomeImg} alt="Welcome" />
                    </div>
                    <div className="welcomeText">
                        <h4>your competitive edge in Clash Royale.</h4>
                        <p>
                            Whether you're <strong className="p-highlight">climbing the ladder</strong> or refining your strategy, Meta Crown delivers actionable insights with clarity and precision. Explore personalised match analytics, optimise your decks with smart comparisons, and track your performance like a true contender. The battle is data driven now—rule the arena with confidence
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;