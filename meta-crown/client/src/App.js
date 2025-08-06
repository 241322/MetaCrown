import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Dashboard from "./Pages/Dashboard";
import DeckCentre from "./Pages/DeckCentre";
import Leaderboard from "./Pages/Leaderboard";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
import Help from "./Pages/Help";
import Landing from "./Pages/Landing";
import Splash from "./Pages/Splash";
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";

function AppContent() {
  const location = useLocation();
  // List of routes where NavBar should be hidden
  const hideNavBarRoutes = ["/", "/login", "/signup"];
  const hideNavBar = hideNavBarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deck-centre" element={<DeckCentre />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </>
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
