import { Box, Grid, IconButton, Typography, Container } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import RedditIcon from "@mui/icons-material/Reddit";
import InstagraIcon from "@mui/icons-material/Instagram";
import React from "react";
let borderStyle = {
  borderRight: "2px solid #3B7AAA",
  borderLeft: "2px solid #3B7AAA",
  borderTop: "2px solid rgb(251, 156, 3)",
  borderBottom: "2px solid rgb(251, 156, 3)",
};
export default function Community() {
  return (
    <Box my={5}>
      <Typography
        color="#3B7AAA"
        sx={{
          fontFamily: "Audiowide",
          textAlign: "center",
        }}
        variant="h4"
      >
        JOIN THE COMMUNITY
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
        }}
      >
        Get to know our main social networks and join our community.
      </Typography>
      <Container maxWidth="md">
        <Box
          mt="50px"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: { lg: "nowrap", md: "wrap" },
          }}
        >
          <a href="https://t.me/+JMGorMX41tM2NGIx" target="_blank">
            <IconButton>
              <TelegramIcon
                sx={{
                  color: "rgb(251, 156, 3)",
                  fontSize: { md: "40px", xs: "30px" },
                }}
              />
            </IconButton>
          </a>
          <a href="https://twitter.com/nextgen_ml" target="_blank">
            <IconButton>
              <TwitterIcon
                sx={{
                  color: "rgb(251, 156, 3)",
                  fontSize: { md: "40px", xs: "30px" },
                }}
              />
            </IconButton>
          </a>
          <a href="#" target="_blank">
            <IconButton>
              <InstagraIcon
                sx={{
                  color: "rgb(251, 156, 3)",
                  fontSize: { md: "40px", xs: "30px" },
                }}
              />
            </IconButton>
          </a>
          <a href="#" target="_blank">
            <IconButton>
              <YouTubeIcon
                sx={{
                  color: "rgb(251, 156, 3)",
                  fontSize: { md: "40px", xs: "30px" },
                }}
              />
            </IconButton>
          </a>
        </Box>
      </Container>
    </Box>
  );
}
