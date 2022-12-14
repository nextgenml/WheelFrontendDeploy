import { Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";

const Footer = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(119.36deg, #02172D 0%, #050B10 14.84%, #3B7AAA 47.66%, #3B7AAAc1 100%)",
        paddingBottom: "50px",
      }}
    >
      <Container>
        <Box
          py="60px"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: { md: "nowrap", xs: "wrap" },
          }}
        >
          <Box mt="10px">
            <a href="#home" style={{ textDecoration: "none" }}>
              <img src="/logo.png" alt="" width="200px" />
            </a>
          </Box>
          <Box mt="10px" px={{ md: "0px", xs: "20px" }}>
            <a
              href="https://www.google.com"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Typography
                sx={{ fontWeight: 400, fontSize: "16px", color: "white" }}
              >
                Twitter
              </Typography>
            </a>
          </Box>
          <Box mt="10px">
            <a href="#" target="_blank" style={{ textDecoration: "none" }}>
              <Typography
                sx={{ fontWeight: 400, fontSize: "16px", color: "white" }}
              >
                Instagram
              </Typography>
            </a>
          </Box>
          <Box mt="10px">
            <a href="#" target="_blank" style={{ textDecoration: "none" }}>
              <Typography
                sx={{ fontWeight: 400, fontSize: "16px", color: "white" }}
              >
                Telegram
              </Typography>
            </a>
          </Box>
          <Box mt="10px">
            <a href="#buy-nextgen" style={{ textDecoration: "none" }}>
              <Typography
                sx={{ fontWeight: 400, fontSize: "16px", color: "white" }}
              >
                Buy NEXTGEN
              </Typography>
            </a>
          </Box>
          <Box mt="10px">
            <a href="#" target="_blank" style={{ textDecoration: "none" }}>
              <Typography
                sx={{ fontWeight: 400, fontSize: "16px", color: "white" }}
              >
                Whitepaper
              </Typography>
            </a>
          </Box>
          <Box mt="10px">
            <a href="#community" style={{ textDecoration: "none" }}>
              <Typography
                sx={{ fontWeight: 400, fontSize: "16px", color: "white" }}
              >
                Community
              </Typography>
            </a>
          </Box>
          <Box mt="10px">
            <Typography
              sx={{ fontWeight: 400, fontSize: "16px", color: "white" }}
            >
              Contact us
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                color: "white",
                mt: "20px",
              }}
            >
              E-Mail:
            </Typography>
          </Box>
        </Box>
        <Container maxWidth="md">
          <Box sx={{ border: "2px solid #242424" }}></Box>
        </Container>
        <Box mt="20px">
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 400,
              color: "white",
            }}
          >
            ?? 2022 NEXTGEN ML ECOSYSTEM. All Rights Reserved.
          </Typography>
        </Box>
        <Box mt="20px">
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: 400,
              color: "white",
            }}
          >
            Disclaimer: The information provided on this website does not
            constitute investment advice, financial advice, trading advice or
            any other form of advice and you should not treat the content of the
            website as such. The NEXTGEN ML team does not recommend buying,
            selling or holding any cryptocurrency. Please conduct your own
            research and consult your financial advisor before making any
            investment decisions. By purchasing the WB token you also agree that
            the team presents the <br /> token "as is" and is not obligated to
            provide any support or service. At CashBull Protocol we are
            committed to developing a GAMEFI that generates benefits for our
            community, integrating the best of a DEFI with an interactive game
            that makes you live new experiences and at the same time earn
            profits while having fun. We expect this value to be reflected in
            the value of the tokens; however, we cannot guarantee the growth of
            token prices, as there are many factors that we do not control as
            the project and the market move forward. But we are doing our best
            to be as successful as possible. Therefore, the CashBull ecosystem
            team is committed to the entire project as a whole, but disclaims
            any exogenous liability that happens to the project. The project is
            100% decentralized, done by and for the community. The community
            will decide the welfare and improvements to be made to the project.
            The Dao voting system will be implemented as soon as the entire
            project is deployed. Although NEXTGEN ML WB is an experimental token
            for social experiments and is not a digital currency, the team
            strongly recommends that U.S. persons do not purchase it because the
            team cannot guarantee compliance with U.S. regulations. Always be
            sure to comply with local laws and regulations before making any
            purchases.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Footer;
