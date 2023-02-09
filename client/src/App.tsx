/* eslint-disable react-hooks/exhaustive-deps */
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import SpinAndWin from "./SpinAndWin";
//import { Routes, Route } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "@mui/material";
import Home from "./components/Home/Home";
import Features from "./components/Features/Features";
import Tokenomics from "./components/Tokenomics/Tokenomics";
import BuyNextGen from "./components/Buy NextGen/BuyNextGen";
import Community from "./components/Community/Community";
import Footer from "./components/Footer/Footer";
import Utilities from "./components/Utilities/Utilities";
import Giveaway from "./components/Giveaway/Giveaway";
import Header from "./components/Header/Header";
import Initiatives from "./components/Initiatives/Initiatives";
import ClaimRedistribution from "./components/Claim Redistribution/ClaimRedistribution";
import ConverseWithAI from "./components/ConverseWithAI/ConverseWithAI";
import NXMLChat from "./components/NXMLChat/NXMLChat";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";

function App() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  return (
    <>
      <Header />
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
        <Route path="/nxml-blog-chat/:initiative" element={<NXMLChat />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
