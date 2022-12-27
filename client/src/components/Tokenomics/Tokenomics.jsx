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
      <Typography
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
      </Typography>
      <Grid container mt={4} spacing={3}>
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
              Marketing Wallet - 5% (Max Wallet)
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
              Dev Wallet - 5% (Max Wallet)
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
            <span style={{ color: "red" }}>****</span>All tokens except the
            reflections in Marketing and Dev wallets are locked for 5 years
          </Typography>
        </Grid>
      </Grid>
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
            Advanced Intelligence – ABCD monetizes content for content owners
            and wallet holders by employing advanced AI techniques
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
            Independent Platform – ABCD provides an independent platform for
            businesses & wallet holders who want to create their own branded
            experiences and make strategic choices.
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
            Data Visibility and Insights – Avoid the data black hole. ABCD
            leverages core tech while maintaining transparency and access to
            usage data and analytics that can optimize the experience.
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
            Get to Market Faster – ABCD uses advanced AI and provides a
            marketplace experience where businesses (buyers) & wallet holders
            (sellers) can quickly partner and achieve targets.
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
            Monetization Vision – ABCD is actively building monetization
            opportunities across the ecosystem across various initiatives and
            helping businesses & wallet holders unlock new revenue streams
            through advanced AI concepts.
          </Typography>
        </li>
      </ul>
      <Typography
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
            Advanced Intelligence – ABCD monetizes content for content owners
            and wallet holders by employing advanced AI techniques
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
            Independent Platform – ABCD provides an independent platform for
            businesses & wallet holders who want to create their own branded
            experiences and make strategic choices.
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
            Data Visibility and Insights – Avoid the data black hole. ABCD
            leverages core tech while maintaining transparency and access to
            usage data and analytics that can optimize the experience.
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
            Get to Market Faster – ABCD uses advanced AI and provides a
            marketplace experience where businesses (buyers) & wallet holders
            (sellers) can quickly partner and achieve targets.
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
            Monetization Vision – ABCD is actively building monetization
            opportunities across the ecosystem across various initiatives and
            helping businesses & wallet holders unlock new revenue streams
            through advanced AI concepts.
          </Typography>
        </li>
      </ul>
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
        How will your ABCD bring utilities for holders?
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
            Advanced Intelligence – ABCD monetizes content for content owners
            and wallet holders by employing advanced AI techniques
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
            Independent Platform – ABCD provides an independent platform for
            businesses & wallet holders who want to create their own branded
            experiences and make strategic choices.
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
            Data Visibility and Insights – Avoid the data black hole. ABCD
            leverages core tech while maintaining transparency and access to
            usage data and analytics that can optimize the experience.
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
            Get to Market Faster – ABCD uses advanced AI and provides a
            marketplace experience where businesses (buyers) & wallet holders
            (sellers) can quickly partner and achieve targets.
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
            Monetization Vision – ABCD is actively building monetization
            opportunities across the ecosystem across various initiatives and
            helping businesses & wallet holders unlock new revenue streams
            through advanced AI concepts.
          </Typography>
        </li>
      </ul>
    </Box>
  );
}
