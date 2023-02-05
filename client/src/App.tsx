/* eslint-disable react-hooks/exhaustive-deps */
import SpinAndWin from "./SpinAndWin";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Home from "./components/Home/Home";
import Features from "./components/Features/Features";
import Tokenomics from "./components/Tokenomics/Tokenomics";
import BuyNextGen from "./components/Buy NextGen/BuyNextGen";
import Community from "./components/Community/Community";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Initiatives from "./components/Initiatives/Initiatives";
import ClaimRedistribution from "./components/Claim Redistribution/ClaimRedistribution";
import ConverseWithAI from "./components/ConverseWithAI/ConverseWithAI";
import SocialSharing from "./components/SocialSharing/SocialSharing";
import Campaigns from "./components/Campaigns/Campaigns";
import Profile from "./components/Profile/Profile";
import Quizzes from "./components/Quizzes/Quizzes";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const [socialSharing, setSocialSharing] = useState(false);
  const blackBgPages = [
    "/",
    "/spin-wheel",
    "/claim-distribution",
    "/spin-wheel",
  ];

  useEffect(() => {
    const includes = blackBgPages.includes(location.pathname);
    document.body.style.backgroundColor = includes ? "black" : "white";
    setSocialSharing(!includes);
  }, [location.pathname]);

  return (
    <>
      <Header socialSharing={socialSharing} />
      <Routes>
        <Route
          path="/"
          element={
            <Container maxWidth="xl">
              <Home />
              <Features />
              <Tokenomics />
              <Initiatives />
              <BuyNextGen />
              <ConverseWithAI />
              <Community />
            </Container>
          }
        />
        <Route path="/claim-distribution" element={<ClaimRedistribution />} />
        <Route path="/spin-wheel" element={<SpinAndWin />} />
        <Route path="/social-sharing" element={<SocialSharing />} />
        <Route path="/user-campaigns" element={<Campaigns />} />
        <Route path="/user-profile" element={<Profile />} />
        <Route path="/user-quizzes" element={<Quizzes />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
