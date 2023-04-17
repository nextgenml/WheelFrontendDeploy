/* eslint-disable react-hooks/exhaustive-deps */
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import "react-toastify/dist/ReactToastify.css";
import SpinAndWin from "./SpinAndWin";
//import { Routes, Route } from "react-router-dom";
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
import NXMLChat from "./components/NXMLChat/NXMLChat";
// import { useAccount } from "wagmi";
// import { useNavigate } from "react-router-dom";
import SocialSharing from "./components/SocialSharing/SocialSharing";
import Campaigns from "./components/Campaigns/Campaigns";
import Profile from "./components/Profile/Profile";
import Quizzes from "./components/Quizzes/Quizzes";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Promotions from "./components/Promotions/Promotions";
import Tokens from "./components/Tokens/Tokens";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Referrals from "./components/Referrals/Referrals";
import PostedBlogs from "./components/PostedBlogs/PostedBlogs";
import TotalEarnings from "./components/TotalEarnings/TotalEarnings";
import Invites from "./components/Invites/Invites";

function App() {
  const location = useLocation();
  const [socialSharing, setSocialSharing] = useState(false);
  const whiteBgPages = ["/promotions", "/tokens", "/referrals"];

  useEffect(() => {
    const includes = true; //whiteBgPages.includes(location.pathname);
    document.body.style.backgroundColor = includes ? "white" : "black";
    setSocialSharing(true);
  }, [location.pathname]);

  return (
    <>
      <Header socialSharing={false} whiteBg={socialSharing} />
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
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route
          path="/referrals"
          element={<PrivateRoute component={<Referrals />} />}
        />
        <Route path="/social-sharing" element={<SocialSharing />} />
        <Route path="/user-campaigns" element={<Campaigns />} />
        <Route path="/user-profile" element={<Profile />} />
        <Route path="/user-quizzes" element={<Quizzes />} />
        <Route path="/posted-blogs" element={<PostedBlogs />} />
        <Route path="/payments" element={<TotalEarnings />} />
        <Route
          path="/referrals/inviteCodes/:code"
          element={<PrivateRoute component={<Invites />} />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
