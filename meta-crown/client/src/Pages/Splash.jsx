import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SignInLogIn.css";

const Splash = () => {
    const navigate = useNavigate();
    const splashRef = useRef(null);

    // Parallax effect handler
    const handleMouseMove = (e) => {
        const splash = splashRef.current;
        if (!splash) return;
        const { width, height, left, top } = splash.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - top) / height - 0.5;
        // Adjust the multiplier for more/less movement
        const moveX = x * 3; // px (was 30)
        const moveY = y * 3; // px (was 30)
        splash.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    };

    const handleMouseLeave = () => {
        if (splashRef.current) {
            splashRef.current.style.backgroundPosition = "50% 50%";
        }
    };

    return (
        <div
            className="splashPage"
            ref={splashRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="splashContainer">
                <h1>Welcome to Meta Crown</h1>
                <h2>Your One Stop Solution for All Things Clash Royale</h2>
                <button className="splashButton" onClick={() => navigate("/login")}>
                    Log In
                </button>
                <button className="splashButton" onClick={() => navigate("/signup")}>
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Splash;