import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SignInLogIn.css";
import backgroundLogIn from "../Assets/backgroundSignUp.jpg";

const LogIn = () => {
  const navigate = useNavigate();
  const splashRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focus, setFocus] = useState({ email: false, password: false });
  const [touched, setTouched] = useState({ email: false, password: false });

  // Validation
  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passwordValid = password.length >= 6;

  // Parallax effect handler (same as Splash)
  const handleMouseMove = (e) => {
    const splash = splashRef.current;
    if (!splash) return;
    const { width, height, left, top } = splash.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    const moveX = x * 3;
    const moveY = y * 3;
    splash.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
  };

  const handleMouseLeave = () => {
    if (splashRef.current) {
      splashRef.current.style.backgroundPosition = "50% 50%";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!emailValid || !passwordValid) return;
    // TODO: Add login logic here
    // After successful login logic, e.g., fetching user data
    const fetchedUsername = email.split("@")[0]; // Mocked fetched username
    localStorage.setItem("username", fetchedUsername); // For LogIn, after fetching user data
    navigate("/landing");
  };

  return (
    <div
      className="splashPage"
      ref={splashRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundImage: `url(${backgroundLogIn})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        backgroundSize: "cover",
      }}
    >
      <div className="splashContainer">
        <h1>Log In</h1>
        <h2>Welcome back to Meta Crown</h2>
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            onFocus={() => setFocus((f) => ({ ...f, email: true }))}
            className={`splashInput${
              focus.email ? " focused" : ""
            }`}
            style={
              touched.email
                ? emailValid
                  ? { border: "2px solid #2ECC71" }
                  : { border: "2px solid #E74C3C" }
                : {}
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            onFocus={() => setFocus((f) => ({ ...f, password: true }))}
            className={`splashInput${
              focus.password ? " focused" : ""
            }`}
            style={
              touched.password
                ? passwordValid
                  ? { border: "2px solid #2ECC71" }
                  : { border: "2px solid #E74C3C" }
                : {}
            }
          />
          <div className="cta-row">
            <button
              className="splashButton"
              type="button"
              onClick={() => navigate("/signup")}
              title="Don't have an account? Sign Up"
            >
              Sign Up
            </button>
            <button
              className="splashButton"
              type="submit"
              disabled={!emailValid || !passwordValid}
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;