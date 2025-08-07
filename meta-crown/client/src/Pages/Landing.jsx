import React from "react";
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

const Landing = () => {
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
                <h3 className="topPickTitle">Today's Top Picks</h3>
                <div className="topPickContent">
                    <div className="topPickCard"></div>
                    <div className="topPickCard"></div>
                    <div className="topPickCard"></div>
                    <div className="topPickCard"></div>
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