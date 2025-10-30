import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SignInLogIn.css";
import backgroundSignUp from "../Assets/backgroundSignUp.jpg";

const SignUp = () => {
  const navigate = useNavigate();
  const splashRef = useRef(null);

  // Step state (target) and visible step (what is "active" in DOM)
  const [step, setStep] = useState(1);
  const [visibleStep, setVisibleStep] = useState(1);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Refs to steps for timing reads
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);

  // Step 1 fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [submitted1, setSubmitted1] = useState(false);
  const [focus1, setFocus1] = useState({ email: false, password: false, password2: false });
  const [touched1, setTouched1] = useState({ email: false, password: false, password2: false });

  // Step 2 fields
  const [username, setUsername] = useState("");
  const [playerTag, setPlayerTag] = useState("#");
  const [submitted2, setSubmitted2] = useState(false);
  const [focus2, setFocus2] = useState({ username: false, playerTag: false });
  const [touched2, setTouched2] = useState({ username: false, playerTag: false });

  // Validation
  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passwordValid = password.length >= 6;
  const password2Valid = password2 === password && password2.length >= 6;
  const usernameValid = username.length >= 3;
  const playerTagValid = /^#[A-Z0-9]{1,15}$/.test(playerTag);

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

  // Handle player tag input (auto-insert #)
  const handlePlayerTagChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("#")) value = "#" + value.replace(/^#+/, "");
    setPlayerTag(value.toUpperCase());
  };

  // Replace the old getMaxAnimMs with a deep scanner:
  const getMaxAnimMsDeep = (root) => {
    if (!root) return 300;
    const nodes = [root, ...root.querySelectorAll('*')];

    const toMs = (val) =>
      (val || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000));

    let max = 0;
    for (const el of nodes) {
      const cs = window.getComputedStyle(el);
      const tDur = toMs(cs.transitionDuration);
      const tDel = toMs(cs.transitionDelay);
      const aDur = toMs(cs.animationDuration);
      const aDel = toMs(cs.animationDelay);
      const tMax = tDur.length ? Math.max(...tDur.map((d,i)=> d + (tDel[i] ?? tDel[0] ?? 0))) : 0;
      const aMax = aDur.length ? Math.max(...aDur.map((d,i)=> d + (aDel[i] ?? aDel[0] ?? 0))) : 0;
      max = Math.max(max, tMax, aMax);
    }
    return Math.max(300, max); // safety floor
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Step 1 submit
  const handleStep1 = async (e) => {
    e.preventDefault();
    setSubmitted1(true);
    if (!emailValid || !passwordValid || !password2Valid || isAdvancing) return;

    setIsAdvancing(true);
    const ms = getMaxAnimMsDeep(step1Ref.current);
    setVisibleStep(0); // let step 1 animate out
    await sleep(ms + 20); // small buffer
    setStep(2);
    setVisibleStep(2); // now show step 2
    setIsAdvancing(false);
  };

  // Step 2 submit
  const handleStep2 = async (e) => {
    e.preventDefault();
    setSubmitted2(true);
    if (!usernameValid || !playerTagValid || isAdvancing) return;

    localStorage.setItem("username", username);
    localStorage.setItem("playerTag", playerTag);

    setIsAdvancing(true);
    const ms = getMaxAnimMsDeep(step2Ref.current);
    setVisibleStep(0); // let step 2 animate out
    await sleep(ms + 20);
    setStep(3);
    setVisibleStep(3);
    setIsAdvancing(false);
  };

  // Step 3 submit (finish) — unchanged
  const handleFinal = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("username")) {
      localStorage.setItem("username", username);
    }
    if (playerTagValid) localStorage.setItem("playerTag", playerTag);
    
    const API_BASE = 'https://metacrown.co.za';
    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_address: email,
          password,                // if using passwords
          username,
          player_tag: playerTag,   // ensure hash included if you store it
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Handle nested user object from server response
        const user = data.user || data;
        localStorage.setItem('user_id', user.id || user.user_id || '');
        localStorage.setItem('username', user.username || username);
        localStorage.setItem('playerTag', user.player_tag || playerTag);
        localStorage.setItem('email', user.email || user.email_address || email);
        localStorage.setItem('is_admin', user.is_admin || false);
        
        console.log('Signup successful, stored user data:', {
          user_id: user.id || user.user_id,
          username: user.username || username,
          email: user.email || user.email_address || email
        });
        
        // Trigger custom event to update NavBar
        window.dispatchEvent(new Event('userUpdated'));
        
        navigate("/dashboard");
      } else {
        console.error('Signup failed:', data);
        // Handle signup error (you might want to show an error message)
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Handle network error
    }
  };

  return (
    <div
      className="splashPage"
      ref={splashRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundImage: `url(${backgroundSignUp})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        backgroundSize: "cover",
      }}
    >
      <div className="splashContainer signup-container">
        <div className="signup-steps-wrapper">
          {/* Step 1 */}
          <form
            ref={step1Ref}
            className={`signup-step ${visibleStep === 1 ? "active" : ""}`}
            onSubmit={handleStep1}
            noValidate
          >
            <h1>Sign Up</h1>
            <h2>Step 1: Account Details</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocus1(f => ({ ...f, email: true }))}
              onBlur={() => setTouched1(t => ({ ...t, email: true }))}
              className={`splashInput${focus1.email ? " focused" : ""}`}
              style={
                touched1.email
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
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocus1(f => ({ ...f, password: true }))}
              onBlur={() => setFocus1(f => ({ ...f, password: false }))}
              className={`splashInput${focus1.password ? " focused" : ""}`}
              style={
                submitted1
                  ? passwordValid
                    ? { border: "2px solid #2ECC71" }
                    : { border: "2px solid #E74C3C" }
                  : {}
              }
            />
            <input
              type="password"
              placeholder="Repeat Password"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              onFocus={() => setFocus1(f => ({ ...f, password2: true }))}
              onBlur={() => setFocus1(f => ({ ...f, password2: false }))}
              className={`splashInput${focus1.password2 ? " focused" : ""}`}
              style={
                submitted1
                  ? password2Valid
                    ? { border: "2px solid #2ECC71" }
                    : { border: "2px solid #E74C3C" }
                  : {}
              }
            />
            {submitted1 && !password2Valid && (
              <span style={{ color: "#E74C3C", fontSize: "0.9rem" }}>
                Passwords do not match or are too short
              </span>
            )}
            <div className="cta-row">
              <button
                className="splashButton"
                type="button"
                onClick={() => navigate("/login")}
                title="Already have an account? Log In"
                disabled={isAdvancing}
              >
                Log In
              </button>
              <button
                className="splashButton"
                type="submit"
                disabled={!emailValid || !passwordValid || !password2Valid || isAdvancing}
              >
                Next
              </button>
            </div>
          </form>

          {/* Step 2 */}
          <form
            ref={step2Ref}
            className={`signup-step ${visibleStep === 2 ? "active" : ""}`}
            onSubmit={handleStep2}
            noValidate
          >
            <h1>Sign Up</h1>
            <h2>Step 2: Profile Details</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onFocus={() => setFocus2(f => ({ ...f, username: true }))}
              onBlur={() => setTouched2(t => ({ ...t, username: true }))}
              className={`splashInput${focus2.username ? " focused" : ""}`}
              style={
                touched2.username
                  ? usernameValid
                    ? { border: "2px solid #2ECC71" }
                    : { border: "2px solid #E74C3C" }
                  : {}
              }
            />
            <input
              type="text"
              placeholder="Player Tag (e.g. #ABCD123)"
              value={playerTag}
              onChange={handlePlayerTagChange}
              onFocus={() => setFocus2(f => ({ ...f, playerTag: true }))}
              onBlur={() => setFocus2(f => ({ ...f, playerTag: true }))}
              className={`splashInput${focus2.playerTag ? " focused" : ""}`}
              maxLength={16}
              style={
                touched2.playerTag
                  ? playerTagValid
                    ? { border: "2px solid #2ECC71" }
                    : { border: "2px solid #E74C3C" }
                  : {}
              }
            />
            {submitted2 && !playerTagValid && (
              <span style={{ color: "#E74C3C", fontSize: "0.9rem" }}>
                Player tag must start with # and be alphanumeric
              </span>
            )}
            <div className="cta-row">
              <button
                className="splashButton"
                type="button"
                onClick={() => navigate("/login")}
                title="Already have an account? Log In"
                disabled={isAdvancing}
              >
                Log In
              </button>
              <button
                className="splashButton"
                type="submit"
                disabled={!usernameValid || !playerTagValid || isAdvancing}
              >
                Next
              </button>
            </div>
          </form>

          {/* Step 3 */}
          <div
            ref={step3Ref}
            className={`signup-step ${visibleStep === 3 ? "active" : ""}`}
          >
            <h1>Welcome, {username}!</h1>
            <h2>Your account has been created.</h2>
            <button className="splashButton" onClick={handleFinal} disabled={isAdvancing}>
              Continue to MetaCrown
            </button>
          </div>
        </div>

        {/* Progress Bar with Notches (driven by target step) */}
        <div className="signup-progress-bar">
          <div
            className="signup-progress"
            style={{
              width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
            }}
          />
          <div className={`signup-notch notch-1 ${step >= 1 ? "filled" : ""}`}></div>
          <div className={`signup-notch notch-2 ${step >= 2 ? "filled" : ""}`}></div>
          <div className={`signup-notch notch-3 ${step === 3 ? "filled" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;