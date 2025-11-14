import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Dashboard from "./Pages/Dashboard";
import DeckCentre from "./Pages/DeckCentre";
import Leaderboard from "./Pages/Leaderboard";
import Profile from "./Pages/Profile";
import Help from "./Pages/Help";
import Admin from "./Pages/Admin";
import Landing from "./Pages/Landing";
import Splash from "./Pages/Splash";
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import NotFound from "./Pages/NotFound";
import Footer from "./Components/Footer";
import MobileOverlay from "./Components/MobileOverlay";

function AppContent() {
  const [data, setData] = useState([])
  useEffect(() => {
    document.title = "MetaCrown";
    fetch("https://metacrown.co.za/cards")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching cards:", error));
  }, []);
  const location = useLocation();
  // List of routes where NavBar should be hidden
  const hideNavBarRoutes = ["/splash", "/login", "/signup"];
  const hideFooterRoutes = ["/splash", "/login", "/signup"];
  const hideNavBar = hideNavBarRoutes.includes(location.pathname);
  const hideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="app-shell">
      <MobileOverlay />
      {!hideNavBar && <NavBar />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deck-centre" element={<DeckCentre />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
