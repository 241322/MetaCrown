import React from "react";
import "../Styles/Landing.css";
import crown from "../Assets/crown.png";
import heroKings from "../Assets/heroKings.png";

const sliderItems = [
    "View card stats",
    "View Leaderboard",
    "Nerf Miner",
    "Zap is Love",
    "Hog Riiiiiider!",
    "View my stats"
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
        </div>
    );
};

export default Landing;