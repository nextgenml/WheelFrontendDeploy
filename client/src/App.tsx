import SpinAndWin from "./SpinAndWin";
import { Routes, Route } from "react-router-dom";
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
function App() {
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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
