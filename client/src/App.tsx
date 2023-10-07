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
// import ClaimRedistribution from "./components/Claim Redistribution/ClaimRedistribution";
import ConverseWithAI from "./components/ConverseWithAI/ConverseWithAI";
import NXMLChat from "./components/NXMLChat/NXMLChat";
// import { useAccount } from "wagmi";
// import { useNavigate } from "react-router-dom";
import SocialSharing from "./components/SocialSharing/SocialSharing";
import Campaigns from "./components/Campaigns/Campaigns";
import Profile from "./components/Profile/Profile";
import Quizzes from "./components/Quizzes/Quizzes";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Promotions from "./components/Promotions/Promotions";
import Tokens from "./components/Tokens/Tokens";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Referrals from "./components/Referrals/Referrals";
import PostedBlogs from "./components/PostedBlogs/PostedBlogs";
import TotalEarnings from "./components/TotalEarnings/TotalEarnings";
import Invites from "./components/Invites/Invites";
import Holders from "./components/Holders/Holders";
import ScheduledSpins from "./components/ScheduledSpins/ScheduledSpins";
import SocialSharingAdmin from "./components/SocialSharingAdmin/SocialSharingAdmin";
import AllocationAdmin from "./components/AllocationsAdmin/AllocationsAdmin";
import MovieTickets from "./components/MovieTickets/MovieTickets";
import PrivateRouteBasic from "./components/PrivateRoute/PrivateRouteBasic";
import TwitterCampaigns from "./components/Twitter/Campaigns";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, [location.pathname]);

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
              {/* <BuyNextGen /> */}
              {/* <ConverseWithAI /> */}
              <Community />
            </Container>
          }
        />
        {/* <Route path="/claim-distribution" element={<ClaimRedistribution />} /> */}
        <Route path="/spin-wheel" element={<SpinAndWin />} />

        <Route
          path="/nxml-blog-chat/:initiative"
          element={<PrivateRoute component={<NXMLChat />} />}
        />
        <Route
          path="/promotions"
          element={<PrivateRoute component={<Promotions />} />}
        />
        <Route path="/tokens" element={<Tokens />} />
        <Route
          path="/referrals"
          element={<PrivateRoute component={<Referrals />} />}
        />
        <Route
          path="/social-sharing"
          element={<PrivateRoute component={<SocialSharing />} />}
        />
        <Route
          path="/user-campaigns"
          element={<PrivateRoute component={<Campaigns />} />}
        />
        <Route
          path="/user-profile"
          element={<PrivateRoute component={<Profile />} />}
        />
        <Route
          path="/user-quizzes"
          element={<PrivateRoute component={<Quizzes />} />}
        />
        <Route
          path="/posted-blogs"
          element={<PrivateRoute component={<PostedBlogs />} />}
        />
        <Route
          path="/payments"
          element={<PrivateRoute component={<TotalEarnings />} />}
        />
        <Route
          path="/referrals/inviteCodes/:code"
          element={<PrivateRoute component={<Invites />} />}
        />
        <Route
          path="/holders"
          element={<PrivateRoute component={<Holders />} />}
        />
        <Route
          path="/scheduled_spins"
          element={<PrivateRoute component={<ScheduledSpins />} />}
        />
        <Route
          path="/social-sharing-admin"
          element={<PrivateRoute component={<SocialSharingAdmin />} />}
        />
        <Route
          path="/allocations-admin"
          element={<PrivateRoute component={<AllocationAdmin />} />}
        />
        <Route
          path="/own-a-memory"
          element={<PrivateRouteBasic component={<MovieTickets />} />}
        />
        <Route
          path="/twitter-promotions"
          element={<PrivateRouteBasic component={<TwitterCampaigns />} />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
