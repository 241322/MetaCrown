import React, { useRef, useState, useEffect } from "react";
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
  const [errorMessage, setErrorMessage] = useState("");

  // Step 2 fields
  const [username, setUsername] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [playerTag, setPlayerTag] = useState("#");
  const [submitted2, setSubmitted2] = useState(false);
  const [focus2, setFocus2] = useState({ username: false, playerTag: false });
  const [touched2, setTouched2] = useState({ username: false, playerTag: false });

  // Step 3 fields
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [finalError, setFinalError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network connectivity monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Validation
  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passwordValid = password.length >= 6;
  const password2Valid = password2 === password && password2.length >= 6;
  const usernameValid = username.length >= 3;
  const playerTagValid = playerTag === "#" || /^#[A-Z0-9]+$/.test(playerTag);

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
    if (errorMessage2) setErrorMessage2("");
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
    setErrorMessage("");
    
    // Validate email
    if (!emailValid) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    
    // Validate password
    if (!passwordValid) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }
    
    // Validate password match
    if (!password2Valid) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    // If we get here, all validation passed
    if (isAdvancing) return;

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
    setErrorMessage2("");
    
    // Validate username
    if (!usernameValid) {
      setErrorMessage2("Username must be at least 3 characters long");
      return;
    }
    
    // Validate player tag (now optional)
    if (!playerTagValid) {
      setErrorMessage2("Player tag must be valid (format: #ABC123) or leave as # for optional");
      return;
    }
    
    if (isAdvancing) return;

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

  // Step 3 submit (finish) with enhanced error handling and retry logic
  const handleFinal = async (e) => {
    e.preventDefault();
    
    // Prevent multiple simultaneous attempts or offline attempts
    if (isCreatingAccount || !isOnline) return;
    
    // Double-check network connectivity
    if (!navigator.onLine) {
      setFinalError("No internet connection. Please check your network and try again.");
      return;
    }
    
    setIsCreatingAccount(true);
    setFinalError("");
    
    // Save to localStorage as backup
    if (!localStorage.getItem("username")) {
      localStorage.setItem("username", username);
    }
    if (playerTagValid) localStorage.setItem("playerTag", playerTag);
    
    const API_BASE = 'https://metacrown.co.za';
    const maxRetries = 3;
    
    const attemptSignup = async (attempt = 1) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_BASE}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            email_address: email,
            password,
            username,
            player_tag: playerTag, // Send the actual value, including "#" for optional
          }),
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          // Try to get error message from server response
          let errorMessage = `Server error (${response.status})`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            // If JSON parsing fails, use default message
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        // Handle nested user object from server response
        const user = data.user || data;
        localStorage.setItem('user_id', user.id || user.user_id || '');
        localStorage.setItem('username', user.username || username);
        localStorage.setItem('playerTag', user.player_tag || (playerTag === "#" ? "" : playerTag));
        localStorage.setItem('email', user.email || user.email_address || email);
        localStorage.setItem('is_admin', user.is_admin || false);
        
        console.log('Signup successful, stored user data:', {
          user_id: user.id || user.user_id,
          username: user.username || username,
          email: user.email || user.email_address || email
        });
        
        // Trigger custom event to update NavBar
        window.dispatchEvent(new Event('userUpdated'));
        
        // Success - navigate to dashboard
        navigate("/dashboard");
        
      } catch (error) {
        console.error(`Signup attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          // Retry after a delay
          setRetryCount(attempt);
          setFinalError(`Connection failed, retrying... (${attempt}/${maxRetries})`);
          setTimeout(() => attemptSignup(attempt + 1), 2000 * attempt); // Exponential backoff
        } else {
          // All retries exhausted
          setIsCreatingAccount(false);
          
          let userFriendlyError = "Failed to create account. Please try again.";
          
          if (error.name === 'AbortError') {
            userFriendlyError = "Request timed out. Please check your internet connection and try again.";
          } else if (error.message.includes('Failed to fetch')) {
            userFriendlyError = "Unable to connect to server. Please check your internet connection and try again.";
          } else if (error.message.includes('email') && error.message.includes('already')) {
            userFriendlyError = "An account with this email already exists. Please use the login page instead.";
          } else if (error.message !== 'Failed to create account. Please try again.') {
            userFriendlyError = error.message;
          }
          
          setFinalError(userFriendlyError);
          setRetryCount(0);
        }
      }
    };
    
    // Start the signup attempt
    await attemptSignup();
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
              onChange={e => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
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
              onChange={e => {
                setPassword2(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
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
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
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
              onChange={e => {
                setUsername(e.target.value);
                if (errorMessage2) setErrorMessage2("");
              }}
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
              placeholder="Player Tag (Optional - e.g. #ABCD123)"
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
            {submitted2 && !playerTagValid && playerTag !== "#" && (
              <span style={{ color: "#E74C3C", fontSize: "0.9rem" }}>
                Player tag must start with # and be alphanumeric
              </span>
            )}
            {errorMessage2 && (
              <div className="error-message">
                {errorMessage2}
              </div>
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
            <h2>
              {!isOnline 
                ? "Connection lost - Please check your internet"
                : isCreatingAccount 
                  ? "Creating your account..." 
                  : "Ready to create your account"
              }
            </h2>
            
            {/* Loading/Retry Status */}
            {isCreatingAccount && (
              <div className="signup-loading-status">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
                {retryCount > 0 && (
                  <p className="retry-text">
                    Connection issues detected. Retrying... ({retryCount}/3)
                  </p>
                )}
                {retryCount === 0 && (
                  <p className="loading-text">
                    Please wait while we create your account...
                  </p>
                )}
              </div>
            )}
            
            {/* Error Message */}
            {finalError && !isCreatingAccount && (
              <div className="error-message">
                {finalError}
              </div>
            )}
            
            {/* Action Button */}
            <button 
              className="splashButton" 
              onClick={handleFinal} 
              disabled={isAdvancing || isCreatingAccount || !isOnline}
            >
              {!isOnline
                ? "No Internet Connection"
                : isCreatingAccount 
                  ? `Creating Account${retryCount > 0 ? ` (Retry ${retryCount}/3)` : '...'}`
                  : "Continue to MetaCrown"
              }
            </button>
            
            {/* Manual Retry Button */}
            {finalError && !isCreatingAccount && (
              <button 
                className="splashButton" 
                onClick={() => {
                  setFinalError("");
                  setRetryCount(0);
                  handleFinal(new Event('click'));
                }}
                style={{ 
                  background: 'linear-gradient(135deg, #e67e22, #d35400)',
                  marginTop: '10px'
                }}
              >
                Try Again
              </button>
            )}
            
            {/* Help Text */}
            {!isCreatingAccount && (
              <p className="help-text" style={{ fontSize: '0.9rem', color: '#B0B0B0', marginTop: '16px' }}>
                Having trouble? Check your internet connection and try again.
              </p>
            )}
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