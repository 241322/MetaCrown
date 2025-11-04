import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SignInLogIn.css";
import backgroundLogIn from "../Assets/backgroundSignUp.jpg";

const LogIn = () => {
  const navigate = useNavigate();
  const splashRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [submitted, setSubmitted] = useState(false);
  const [focus, setFocus] = useState({ email: false, password: false });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    
    // Client-side validation
    if (!emailValid || !passwordValid) {
      setErrorMessage("It appears you have entered an invalid email address or password");
      setIsLoading(false);
      return;
    }
    
    const API_BASE = 'https://metacrown.co.za';
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_address: email,
          password, // if you use passwordless/OTP, remove
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Login failed:', data);
        setErrorMessage("It appears you have entered an invalid email address or password");
        setIsLoading(false);
        return;
      }
      
      // Handle nested user object from server response
      const user = data.user || data;
      localStorage.setItem('user_id', user.id || user.user_id || '');
      localStorage.setItem('username', user.username || '');
      localStorage.setItem('playerTag', user.player_tag || '');
      localStorage.setItem('email', user.email || user.email_address || '');
      localStorage.setItem('is_admin', user.is_admin || false);
      localStorage.setItem('token', data.token || '');
      
      console.log('Login successful, stored user data:', {
        user_id: user.id || user.user_id,
        username: user.username,
        email: user.email || user.email_address
      });
      
      // Trigger custom event to update NavBar
      window.dispatchEvent(new Event('userUpdated'));
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMessage("It appears you have entered an invalid email address or password");
      setIsLoading(false);
    }
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
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
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
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
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
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
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
              disabled={!emailValid || !passwordValid || isLoading}
            >
              {isLoading ? "Logging In..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;