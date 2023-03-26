import { Box, Grid, Typography } from "@mui/material";
import GameSection from "../../components/GameSection/GameSection";

import React from "react";
let borderStyle = {
  borderRight: "2px solid #3B7AAA",
  borderLeft: "2px solid #3B7AAA",
  borderTop: "2px solid rgb(251, 156, 3)",
  borderBottom: "2px solid rgb(251, 156, 3)",

  "&:hover": {
    borderBottom: "2px solid #3B7AAA",
    borderRight: "2px solid rgb(251, 156, 3)",
    borderTop: "2px solid #3B7AAA",
    borderLeft: "2px solid rgb(251, 156, 3)",
  },
};

export default function Utilities() {
  return (
    <Box>
      <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
          marginTop: "40px",
        }}
        variant="h4"
        id="utilities"
      >
        VARIOUS UTILITIES
      </Typography>
      <GameSection />

      {/* <Grid container mt={4} spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="rgb(251, 156, 3)"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Wheel Rewards
            </Typography>
            <Typography
              
              sx={{
                textAlign: "justify",
                mt: 2,
              }}
            >
              An authentic experience that your token holders will love Engaged.
              Devoted. Loyal. Does this describe our Token Holders? It can. 
            </Typography>
          </Box>
        </Grid>{" "}
        <Grid item xs={12} sm={6}>
          <Box sx={borderStyle} borderRadius="10px" p={2} height="100%">
            <Typography
              color="rgb(251, 156, 3)"
              sx={{
                fontFamily: "Audiowide",
                textAlign: "center",
              }}
              variant="h6"
            >
              Daily Rewards
            </Typography>
            <Typography
              
              sx={{
                textAlign: "justify",
                mt: 2,
              }}
            >
              Wheel Rewards are powered by an advanced automation engine that
              looks into blocks every 6 hours, picks the top 25 holders (based
              on max transactions size by wallet), and puts them on a wheel. The
              wheel runs at a predetermined time and selects three winners; in a
              day, we pick 12 winners.
            </Typography>
          </Box>
        </Grid>
      </Grid> */}
    </Box>
  );
}
