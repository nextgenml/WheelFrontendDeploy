import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import Utilities from "../../components/Utilities/Utilities";

let borderStyle = {
  borderRight: "2px solid #3B7AAA",
  borderLeft: "2px solid #3B7AAA",
  borderTop: "2px solid rgb(251, 156, 3)",
  borderBottom: "2px solid rgb(251, 156, 3)",
  textTransform: "uppercase",
  background:
    "linear-gradient(0deg, rgba(251,156,5,1) 0%, rgba(59,122,170,1) 100%)",
  "&:hover": {
    borderBottom: "2px solid #3B7AAA",
    borderRight: "2px solid rgb(251, 156, 3)",
    borderTop: "2px solid #3B7AAA",
    borderLeft: "2px solid rgb(251, 156, 3)",
  },
};
export default function Tokenomics() {
  return (
    <Box my={5} id="tokenomics">
      {/* <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
        }}
        variant="h4"
      >
        TOKENOMICS
      </Typography>
      <Typography
        color="white"
        sx={{
          textAlign: "center",
        }}
      >
        Total Tax 15% Buy & Sell
      </Typography> */}
      {/* <Grid container mt={4} spacing={3}>
        <Grid item xs={6} sm={6} md={4}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Liquidity - 5%
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Wheel - 3%
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Burn - 1 token every second for 2 years
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Reflections - 5%
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Marketing Wallet - 1% (Max Wallet)
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="white"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Development Wallet - 1% (Max Wallet)
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            <span style={{ color: "red" }}>*</span>Burn Wallet auto burn stops
            after two years, after which manual burn will follow <br />
            <span style={{ color: "red" }}>**</span>creator earns 1% of all buy
            and sell
            <br />
            <span style={{ color: "red" }}>***</span> liquidity locked for 5
            years
            <br />
            <span style={{ color: "red" }}>****</span>
            Reflections earned within Marketing & Development wallets will be
            periodically sold to meet the expense and needs of the project.
          </Typography>
        </Grid>
      </Grid> */}
      <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
        }}
        variant="h4"
        mt={4}
        id="services"
      >
        SERVICES
      </Typography>
      <ul>
        <li>
          {" "}
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            <b>Advanced Intelligence –</b> NEXGEN ML leverages advanced AI
            techniques to monetize content for content owners and wallet
            holders. These techniques include Natural Language Processing (NLP),
            Machine Learning (ML), Deep Learning, Computer Vision, Predictive
            Analytics, Reinforcement Learning, Recommender Systems, Sentiment
            Analysis, Anomaly Detection, and Image Recognition. These
            technologies are used to analyze and process vast amounts of data,
            enabling NEXGEN ML to provide personalized and relevant content to
            users, while also providing valuable insights and generating
            revenue. By combining cutting-edge AI technologies with blockchain,
            NEXGEN ML is able to create a secure and efficient platform for
            content monetization.
          </Typography>
        </li>
        <li>
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            <b>Independent Platform –</b> NEXGEN ML provides businesses and
            wallet holders with an independent platform that enables them to
            create their own branded experiences and make strategic choices. The
            platform offers a range of branded experiences including
            personalized content and recommendations, branded digital wallets,
            customizable token economics, customizable marketing campaigns,
            data-driven insights and analytics, branded NFT offerings,
            collaborative content creation and distribution, user-generated
            content management, influencer management, and monetization, and
            branded data marketplaces. This independence gives businesses and
            wallet holders the power to control their brand and data and the
            ability to monetize it in a way that aligns with their goals and
            strategies.
          </Typography>
        </li>
        <li>
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            <b>Data Visibility and Insights –</b> NEXGEN ML provides a solution
            for businesses and wallet holders who want to avoid the data black
            hole. The platform leverages advanced technology to offer
            transparency and insights into data usage and analytics. With top
            analytics techniques, NEXGEN ML empowers businesses to make informed
            decisions and optimize the user experience by gaining access to
            critical usage data and insights. With this platform, businesses can
            make strategic choices and maintain control over their data while
            enjoying the benefits of increased visibility and insights.
          </Typography>
        </li>
        <li>
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            <b>Get to Market Faster –</b> NEXGEN ML provides an advanced
            AI-powered marketplace experience for businesses and wallet holders
            to quickly partner and achieve their targets. With a focus on speed
            and efficiency, NEXGEN ML offers ways for businesses to get to
            market faster, including leveraging AI technology, providing a
            user-friendly platform, and promoting collaboration and
            partnerships. Whether you are a buyer or a seller, NEXGEN ML offers
            the tools and resources you need to succeed in the digital
            marketplace. couple of top ways NEXGEN ML will help are AI-powered
            marketplace, Streamlined partnerships and negotiations, Seamless
            product and service delivery, Automated pricing and negotiation
            tools, Efficient payment and settlement processes, Customizable
            branding and marketing materials, Access to a large network of
            buyers and sellers, Robust analytics and data insights, Transparent
            and secure transactions, Ongoing support and resources to help
            maximize success.
          </Typography>
        </li>
        <li>
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            <b>Monetization Vision –</b> NEXGEN ML is offering various AI and
            blockchain-based services to help businesses and wallet holders
            unlock new revenue streams. One example is personalized advertising,
            where AI algorithms analyze customer data and target them with
            personalized ads, resulting in higher conversion rates and increased
            revenue. Another service is AI-powered content creation and
            distribution, using machine learning to predict what type of content
            will perform well and automating the distribution process. NEXGEN ML
            also provides AI-powered e-commerce services, optimizing pricing and
            product recommendations to drive sales. Additionally, the platform
            offers AI-powered market research and insights, providing businesses
            with data-driven insights to inform decision making and drive
            growth. These are just a few of the many AI concepts NEXGEN ML is
            using to help businesses and wallet holders unlock new revenue
            streams.
          </Typography>
        </li>
      </ul>
      {/* <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
        }}
        variant="h4"
        mt={4}
        id="roadmap"
      >
        ROADMAP
      </Typography> */}
      {/* <ul>
        <li>
          {" "}
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            Phase 1 – Launch socials - Telegram, Twitter, Facebook, Youtube,
            Launch Quiz, Launch Blog
          </Typography>
        </li>
        <li>
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            Phase 2 - Publish Whitepaper for NEXGEN ML, Launch AI utlity 1,
            Launch AI Utility 2
          </Typography>
        </li>
        <li>
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            Phase 3 - Launch Automated AI - Blockchain SPIN Wheel
          </Typography>
        </li>
        <li>
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            Phase 4 - List on coin market cap & coin gecko, Launch Initiatve 1
          </Typography>
        </li>
        <li>
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            Phase 5 - Launch Initiative 5
          </Typography>
        </li>
      </ul> */}
      <Utilities />
      <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
        }}
        variant="h4"
        mt={4}
      >
        How will NEXGEN ML bring utilities for holders?
      </Typography>
      <ul>
        <li>
          {" "}
          <Typography
            color="white"
            sx={{
              textAlign: "left",
              mt: 2,
            }}
          >
            NEXGEN ML provides unique and innovative utility options for its
            token holders that have never been seen before within the
            decentralized world. For example, the platform might offer access to
            exclusive services or products that can only be obtained through
            holding NEXGEN ML tokens. Additionally, the platform might
            incentivize certain actions within the ecosystem through the
            issuance of tokens. The goal is to provide token holders with a
            range of benefits that go beyond what is typically offered in
            traditional decentralized ecosystems. By doing so, NEXGEN ML aims to
            add value to its token holders and create a thriving and dynamic
            community. Below are a few
          </Typography>
        </li>
      </ul>
    </Box>
  );
}
